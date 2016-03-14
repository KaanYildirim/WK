angular.module('starter.controllers', []).controller('IntroCtrl', function($scope, $state, $localstorage, userService) {
    if ($localstorage.get("device") === "web") {
    	$scope.loggingIn = false;
	    $scope.login = function() {
	        if (!$scope.loggingIn) {
	            $scope.loggingIn = true;
	            userService.loginUser().then(function() {
	                $scope.loggingIn = false;
	                $state.go('tab.browse');
	            });
	        }
	    }
    } 
    else {
    	$scope.login = function() {
    		console.log('nativeLogin')
	    	userService.nativeLogin().then(function() {
	            $state.go('tab.browse');
	        });
    	}
    }
})

.controller('topicsCtrl', function($scope, $rootScope, $state) {
    // Call a "LoadFeed" method from another controller (browseCtrl) ////
    $scope.loadBrowseFeed = function() {
        $rootScope.$emit("LoadFeed", {});
    };
    // Topic Selection //
    $scope.setSelectedTopic = function(topic) {
        window.localStorage.setItem("selectedTopic", topic);
    };
    //After user pushes "Start" button, topics navigation is cleared and start from the beginning
    $scope.clearNavHistory = function() {
        $state.go('tab.topics');
    };
})

.filter('internalreverse', function() {
    return function(input) {
        input = input || [];
        input.sort(function(a, b) {
            if (a.id > b.id) {
                return -1;
            }
            if (a.id < b.id) {
                return 1;
            }
            // a must be equal to b
            return 0;
        });
        return input;
    };
})

.controller('browseCtrl', function($scope, $rootScope, $firebaseArray, $window, $localstorage, $state, userService, myService, $cordovaSocialSharing, $ionicHistory) {
	// console.log("current: " + $localstorage.get('user', null))
	$scope.$parent.$on('$ionicView.loaded', function(scopes){
        /*if(	JSON.stringify($localstorage.get("user")) == "null" ||
         	JSON.stringify($localstorage.get("user")) == null ||
         	$JSON.stringify($localstorage.get("user")) === "null" ||
         	$JSON.stringify($localstorage.get("user")) === null ||
         	$localstorage.get("user") == undefined ||
         	$localstorage.get("user") === undefined ||
         	$JSON.stringify($localstorage.get("user")) == "undefined" ||
         	$JSON.stringify($localstorage.get("user")) === "undefined") {
            console.log('going back')
        }
        if ($localstorage.get('user').indexOf('facebook') > -1) {
            $state.go('intro');
        } else {
        	console.log("false")
        }*/
        console.log($localstorage.get('user'))
        if ($localstorage.get('user')) {
	        console.log($localstorage.get('user').indexOf('facebook'))
	        if ($localstorage.get('user').indexOf('facebook') <= 0) {
	            $state.go('intro');
	        } 
        }
        else {
            $state.go('intro');
        }
	})
	/*$scope.$on('$ionicView.loaded', function(scopes){
    });*/
    // to call "user.saveContent(card)"
    $scope.user = userService;
    // Because of this method, topicCtrl can call the "LoadFeed" function in this controller
    $rootScope.$on("LoadFeed", function() {
        $scope.loadFeed();
    });
    $scope.cardDestroyed = function(index, card) {
        //Determine the current selected topic
        var selectedTopic = window.localStorage.getItem("selectedTopic");
        //Create TopicIndex and save the curent swiped cards Content Number
        window.localStorage.setItem(selectedTopic + "Index", card.contentNumber);
        //console.log("Card Destroyed: " + card.contentNumber);
        $scope.cards.splice(index, 1);
    };
    $scope.cardSwiped = function(index) {};
    //Save myService to the local storage//
    $scope.updateCollectionTab = function() {
        //window.localStorage.setItem("savedContent",JSON.stringify($scope.cards[index]));
        // Call a "loadList" method from another controller (CollectionsCtrl) ////
        $rootScope.$emit("loadList", {});
    };
    $scope.actionButton = function(index) {
        //console.debug("read");
        $window.open($scope.cards[index].link, "_system", "location=yes");
    };
    $scope.share = function(index) {
        $cordovaSocialSharing.share($scope.cards[index].title, $scope.cards[index].title, $scope.cards[index].image, $scope.cards[index].link);
    };
    $scope.loadFeed = function() {
        //console.log("LoadFeed is called");
        $scope.cards = [];
        //For first time users: If there is no selectedTopic section in the memory,
        //then it will be created and will be set to "". This way users see:
        //"You have to select topic first"
        if (window.localStorage.getItem("selectedTopic") == null) {
            window.localStorage.setItem("selectedTopic", "");
        }
        // Determine the selection and take the content from Firebase Service
        if (window.localStorage.getItem("selectedTopic") == "") {
            $scope.noSelectedTopic = true;
            $scope.loading = false;
            //console.log("selectedTopic is null");
        } else {
            $scope.loading = true;
            $scope.noSelectedTopic = false;
            $scope.SelectedTopic = window.localStorage.getItem("selectedTopic"); //For title on the card.
            var selectedTopic = window.localStorage.getItem("selectedTopic");
            //If the topic is selected for the first time it will set to "0"
            if (window.localStorage.getItem(selectedTopic + "Index") == null) {
                window.localStorage.setItem(selectedTopic + "Index", "0");
            };
            var selectedTopicIndex = window.localStorage.getItem(selectedTopic + "Index");
            $scope.cards = myService.getContent(selectedTopic, selectedTopicIndex);
            $scope.cards.$loaded().then(function(data) {
                $scope.loading = false;
            });
            console.log($scope.cards);
            //$scope.loading=false;
        };
    };
    //$scope.loadFeed(); // alternative to data-ng-init="loadFeed()"
})

.controller('collectionCtrl', function($scope, $rootScope, userService, $firebaseArray, $localstorage, $window, $cordovaSocialSharing) {
    $scope.loading = true;
    $scope.user = userService;
    // Beacause of this method, browseCtrl can call the "LoadList" function in this controller
    $rootScope.$on("loadList", function() {
        $scope.loadList();
    });
    var userID = $localstorage.get('user', null);
    var saved = new Firebase("https://wavepreneur1.firebaseio.com/users/" + userID + "/savedContent");
    // Get Saved Content from Firebase
    $scope.loadList = function() {
        if (saved) {
            $scope.loading = true;
            $scope.savedCards = $firebaseArray(saved);
            //console.log($scope.savedCards);
            $scope.savedCards.$loaded().then(function(data) {
                $scope.loading = false;
            });
            //console.log($scope.savedCards);
        }
    };
    $scope.share = function(cards) {
        $cordovaSocialSharing.share(cards.card.title, cards.card.title, cards.card.image, cards.card.link);
    };
    $scope.actionButton = function(cards) {
        //console.debug(cards.card.link);
        $window.open(cards.card.link, "_system", "location=yes");
    };
    $scope.clearNavHistory = function() {
        $state.go('tab.collection');
    };
})



.controller('chatCtrl', function($scope) {
    
    $scope.setChatRoomName = function(name){
        window.localStorage.setItem("chatroomName", name);
    };


})

.controller('chatroomCtrl', function($scope, FIREBASE_URL, userService, $firebaseArray,$firebaseObject, $localstorage, $ionicScrollDelegate) {
    
    $scope.chatroomName=window.localStorage.getItem("chatroomName");
    var ChatroomName=window.localStorage.getItem("chatroomName");
    
    $scope.user = userService;     
    $scope.data = {
        messages: [],
        message: '',
        loading: true,
        showInfo: false
    };

    var Content = new Firebase(FIREBASE_URL + "/" + ChatroomName + "/messages");
  
    //Get current users info
    var userID = $localstorage.get('user', null);  
    var userInfo = new Firebase("https://wavepreneur1.firebaseio.com/users/" + userID);
    userInfo=$firebaseObject(userInfo);
    

    $scope.loadMessages = function () {
        $scope.data.messages=$firebaseArray(Content);
        $scope.data.messages.$loaded().then(function(data){
            $scope.data.loading=false;
            $ionicScrollDelegate.$getByHandle('chatroom').scrollBottom(true);
        });
    };

    $scope.sendMessage = function () {
        if($scope.data.message){
            $scope.data.messages.$add({
                text: $scope.data.message,
                username: userInfo.name,
                userId: userInfo.userId,
                profilePic: userInfo.profilePic,
                //timestamp: new Date().getTime
            });
            $scope.data.message ='';
            $ionicScrollDelegate.$getByHandle('chatroom').scrollBottom(true);
        }
    };

    $scope.loadMessages();
})


.controller('settingsCtrl', function($scope, $state, userService, $ionicPopup, $localstorage) {
    $scope.user = userService;
    
    //User Logout
    $scope.logout = function() {
        userService.logoutUser();
        $state.go('intro');
    };

    // Delete Account??
    $scope.showConfirm = function() {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Delete Account',
            template: 'Your account & saved cards will be deleted permanently.'
        });

        confirmPopup.then(function(res) {
        if(res) {

            //Get current user's ID & connect firebase & remove the user's node
            var userID = $localstorage.get('user', null);
            var userAccount = new Firebase("https://wavepreneur1.firebaseio.com/users/" + userID);
            userAccount.remove();

            //Delete Local Storage
            window.localStorage.clear();
            
            //Go to "intro" screen
            $state.go('intro');

            console.log('Account deleted');
        }else {
            console.log('Account not deleted');
        }
    });

 };

})

.controller('feedbackCtrl', function($scope, $state, userService, $ionicPopup) {
    $scope.user = userService;
    
   

 })

