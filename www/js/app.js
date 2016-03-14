// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngCordova', 'firebase', 'angularMoment', 'starter.controllers', 'starter.services', 'ionic.contrib.ui.tinderCards'])
    //    Facebook & Firebase ID's //
    .constant("FIREBASE_URL", 'https://wavepreneur1.firebaseio.com').constant("FACEBOOK_APP_ID", '1529442214021222').run(function($ionicPlatform, $localstorage) {
        $ionicPlatform.ready(function() {            
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs) 
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
            if (!$localstorage.get("device")) {
              (document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1) ? $localstorage.set("device", "mobile") : $localstorage.set("device", "web")
              console.log("running in: " + $localstorage.get("device"))
            }
        });
    }).config(function($stateProvider, $urlRouterProvider, FACEBOOK_APP_ID) {
        openFB.init({
            appId: FACEBOOK_APP_ID
        });
        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider
        // setup an abstract state for the tabs directive
            .state('tab', {
                url: '/tab',
                abstract: true,
                templateUrl: 'templates/tabs.html'
            })
            // Each tab has its own nav history stack:
            .state('intro', {
                url: '/intro',
                templateUrl: 'templates/intro.html',
                controller: 'IntroCtrl'
            })

            .state('tab.topics', {
                url: '/topics',
                views: {
                    'tab-topics': {
                        templateUrl: 'templates/tab-topics.html',
                        controller: 'topicsCtrl'
                    }
                }
            })

            .state('tab.beachtopics', {
                url: '/topics/beachtopics',
                views: {
                    'tab-topics': {
                        templateUrl: 'templates/beachtopics.html',
                        controller: 'topicsCtrl'
                    }
                }
            })

            .state('tab.watertopics', {
                url: '/topics/watertopics',
                views: {
                    'tab-topics': {
                        templateUrl: 'templates/watertopics.html',
                        controller: 'topicsCtrl'
                    }
                }
            })

            .state('tab.wavetopics', {
                url: '/topics/wavetopics',
                views: {
                    'tab-topics': {
                        templateUrl: 'templates/wavetopics.html',
                        controller: 'topicsCtrl'
                    }
                }
            })

            .state('tab.browse', {
                url: '/browse',
                views: {
                    'tab-browse': {
                        templateUrl: 'templates/tab-browse.html',
                        controller: 'browseCtrl'
                    }
                }
            })

            .state('tab.collection', {
                url: '/collection',
                views: {
                    'tab-collection': {
                        templateUrl: 'templates/tab-collection.html',
                        controller: 'collectionCtrl'
                    }
                }
            })

            .state('tab.chat', {
                url: '/chat',
                views: {
                    'tab-chat': {
                        templateUrl: 'templates/tab-chat.html',
                        controller: 'chatCtrl'
                    }
                }
            })

            .state('tab.chatroom', {
                url: '/chat/chatroom',
                views: {
                    'tab-chat': {
                        templateUrl: 'templates/chatroom.html',
                        controller: 'chatroomCtrl'
                    }
                }
            })

            .state('tab.settings', {
                url: '/chat/settings',
                views: {
                    'tab-chat': {
                        templateUrl: 'templates/settings.html',
                        controller: 'settingsCtrl'
                    }
                }
            })

        // if none of the above states are matched, use this as the fallback
        // $urlRouterProvider.otherwise('intro');
        $urlRouterProvider.otherwise('tab/browse');
    });