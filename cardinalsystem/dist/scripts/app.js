(function () {
    'use strict';
    angular.module('app', [
    	'ngRoute',
    	'ngAnimate',
    	'ngAria',
    	'ui.bootstrap',
    	'ngTagsInput',
    	'textAngular',
    	'angular-loading-bar',
    	'duScroll',
        'ngCsvImport',
        'dndLists',
        'ui.router', 
        'ngCookies', 
        'ngSanitize',
        'ngTable',
        'angular-md5',
        'ui.tree',
        'ngFileUpload',
        'angularFileUpload',
        'naif.base64', 
        'app.nav',
        'app.i18n',
        'app.chart',
        'app.ui',
        'app.ui.form',
        'app.ui.form.validation',
        'app.page',
        'app.table',
        'app.task',
        'app.importacion'
    ]);
})();






    


;
(function () {
    'use strict';

    angular.module('app.task', []);

})();

;
(function () {
    'use strict';

    angular.module('app.chart', ['ngecharts']);
})(); 
;
(function () {
    'use strict';

    angular.module('app.ui.form', []);
})(); 
;
(function () {
    'use strict';

    angular.module('app.ui.form.validation', ['validation.match']);
})(); 
;
(function () {
    'use strict';

    angular.module('app.nav', ['ngSanitize']);

})(); 
;
(function () {
    'use strict';

    angular.module('app.page', []);
})(); 
;
(function () {
    'use strict';

    angular.module('app.table', []);
})(); 
;
(function () {
    'use strict';

    angular.module('app.ui', ['ui.router']);
})(); 
;
(function () {
    'use strict';

    angular.module('app.task')
        .controller('taskCtrl', [ '$scope', 'taskStorage', 'filterFilter', '$rootScope', 'logger', taskCtrl]);
        
    function taskCtrl($scope, taskStorage, filterFilter, $rootScope, logger) {
        var tasks;

        tasks = $scope.tasks = taskStorage.get();

        $scope.newTask = '';

        $scope.remainingCount = filterFilter(tasks, {completed: false}).length;

        $scope.editedTask = null;

        $scope.statusFilter = {
            completed: false
        };

        $scope.filter = function(filter) {
            switch (filter) {
                case 'all':
                    return $scope.statusFilter = '';
                case 'active':
                    return $scope.statusFilter = {
                        completed: false
                    };
                case 'completed':
                    return $scope.statusFilter = {
                        completed: true
                    };
            }
        };

        $scope.add = function() {
            var newTask;
            newTask = $scope.newTask.trim();
            if (newTask.length === 0) {
                return;
            }
            tasks.push({
                title: newTask,
                completed: false
            });
            logger.logSuccess('New task: "' + newTask + '" added');
            taskStorage.put(tasks);
            $scope.newTask = '';
            $scope.remainingCount++;
        };

        $scope.edit = function(task) {
            $scope.editedTask = task;
        };

        $scope.doneEditing = function(task) {
            $scope.editedTask = null;
            task.title = task.title.trim();
            if (!task.title) {
                $scope.remove(task);
            } else {
                logger.log('Task updated');
            }
            taskStorage.put(tasks);
        };

        $scope.remove = function(task) {
            var index;
            $scope.remainingCount -= task.completed ? 0 : 1;
            index = $scope.tasks.indexOf(task);
            $scope.tasks.splice(index, 1);
            taskStorage.put(tasks);
            logger.logError('Task removed');
        };

        $scope.completed = function(task) {
            $scope.remainingCount += task.completed ? -1 : 1;
            taskStorage.put(tasks);
            if (task.completed) {
                if ($scope.remainingCount > 0) {
                    if ($scope.remainingCount === 1) {
                        logger.log('Almost there! Only ' + $scope.remainingCount + ' task left');
                    } else {
                        logger.log('Good job! Only ' + $scope.remainingCount + ' tasks left');
                    }
                } else {
                    logger.logSuccess('Congrats! All done :)');
                }
            }
        };

        $scope.clearCompleted = function() {
            $scope.tasks = tasks = tasks.filter(function(val) {
                return !val.completed;
            });
            taskStorage.put(tasks);
        };

        $scope.markAll = function(completed) {
            tasks.forEach(function(task) {
                task.completed = completed;
            });
            $scope.remainingCount = completed ? 0 : tasks.length;
            taskStorage.put(tasks);
            if (completed) {
                logger.logSuccess('Congrats! All done :)');
            }
        };

        $scope.$watch('remainingCount == 0', function(val) {
            $scope.allChecked = val;
        });

        $scope.$watch('remainingCount', function(newVal, oldVal) {
            $rootScope.$broadcast('taskRemaining:changed', newVal);
        });

    }
})(); 
;
(function () {
    'use strict';

    angular.module('app.task')
        .directive('taskFocus', ['$timeout', taskFocus]);

    // cusor focus when dblclick to edit
    function taskFocus($timeout) {
        var directive = {
            link: link
        };

        return directive;

        function link (scope, ele, attrs) {
            scope.$watch(attrs.taskFocus, function(newVal) {
                if (newVal) {
                    $timeout(function() {
                        return ele[0].focus();
                    }, 0, false);
                }
            });
        }
    }

})(); 

;
(function () {
    'use strict';

    angular.module('app.task')
        .factory('taskStorage', taskStorage);


    function taskStorage() {
        var STORAGE_ID, DEMO_TASKS;

        STORAGE_ID = 'tasks';
        DEMO_TASKS = '[ {"title": "Upgrade to Yosemite", "completed": true},' +
            '{"title": "Finish homework", "completed": false},' +
            '{"title": "Try Google glass", "completed": false},' +
            '{"title": "Build a snowman :)", "completed": false},' +
            '{"title": "Play games with friends", "completed": true},' +
            '{"title": "Learn Swift", "completed": false},' +
            '{"title": "Shopping", "completed": true} ]';

        return {
            get: function() {
                return JSON.parse(localStorage.getItem(STORAGE_ID) || DEMO_TASKS );
            },

            put: function(tasks) {
                return localStorage.setItem(STORAGE_ID, JSON.stringify(tasks));
            }
        }
    }
})(); 
;
(function () {
    'use strict';

    angular.module('app.chart')
        .controller('EChartsCtrl', ['$scope', '$timeout', EChartsCtrl])

    function EChartsCtrl($scope, $timeout) {
        // Build ECharts with Bar, Line, Pie, Radar, Scatter, Chord, Gauge, Funnel

        $scope.line1 = {};
        $scope.line2 = {};
        $scope.line3 = {};
        $scope.line4 = {};

        $scope.bar1 = {};
        $scope.bar2 = {};
        $scope.bar3 = {};
        $scope.bar4 = {};
        $scope.bar5 = {};

        $scope.pie1 = {};
        $scope.pie2 = {};
        $scope.pie4 = {};

        $scope.scatter1 = {};
        $scope.scatter2 = {};

        $scope.radar1 = {};
        $scope.radar2 = {};

        $scope.gauge1 = {};

        $scope.chord1 = {};

        $scope.funnel1 = {};

        $scope.line1.options = {
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                data:['Highest temperature','Lowest temperature']
            },
            toolbox: {
                show : true,
                feature : {
                    restore : {show: true, title: "restore"},
                    saveAsImage : {show: true, title: "save as image"}
                }
            },
            calculable : true,
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : false,
                    data : ['Mon.','Tue.','Wed.','Thu.','Fri.','Sat.','Sun.']
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    axisLabel : {
                        formatter: '{value} °C'
                    }
                }
            ],
            series : [
                {
                    name:'Highest temperature',
                    type:'line',
                    data:[11, 11, 15, 13, 12, 13, 10],
                    markPoint : {
                        data : [
                            {type : 'max', name: 'Max'},
                            {type : 'min', name: 'Min'}
                        ]
                    },
                    markLine : {
                        data : [
                            {type : 'average', name: 'Average'}
                        ]
                    }
                },
                {
                    name:'Lowest temperature',
                    type:'line',
                    data:[1, -2, 2, 5, 3, 2, 0],
                    markPoint : {
                        data : [
                            {name : 'Lowest temperature', value : -2, xAxis: 1, yAxis: -1.5}
                        ]
                    },
                    markLine : {
                        data : [
                            {type : 'average', name : 'Average'}
                        ]
                    }
                }
            ]
        };
        $scope.line2.options = {
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                data:['Email','Affiliate','Video Ads','Direct','Search']
            },
            toolbox: {
                show : true,
                feature : {
                    restore : {show: true, title: "restore"},
                    saveAsImage : {show: true, title: "save as image"}
                }
            },
            calculable : true,
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : false,
                    data : ['Mon.','Tue.','Wed.','Thu.','Fri.','Sat.','Sun.']
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [
                {
                    name:'Email',
                    type:'line',
                    stack: 'Sum',
                    data:[120, 132, 101, 134, 90, 230, 210]
                },
                {
                    name:'Affiliate',
                    type:'line',
                    stack: 'Sum',
                    data:[220, 182, 191, 234, 290, 330, 310]
                },
                {
                    name:'Video Ads',
                    type:'line',
                    stack: 'Sum',
                    data:[150, 232, 201, 154, 190, 330, 410]
                },
                {
                    name:'Direct',
                    type:'line',
                    stack: 'Sum',
                    data:[320, 332, 301, 334, 390, 330, 320]
                },
                {
                    name:'Search',
                    type:'line',
                    stack: 'Sum',
                    data:[820, 932, 901, 934, 1290, 1330, 1320]
                }
            ]
        };
        $scope.line3.options = {
            title : {
                text: 'Sales',
            },
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                data:['Intention','Pre-order','Deal closed']
            },
            toolbox: {
                show : true,
                feature : {
                    restore : {show: true, title: "restore"},
                    saveAsImage : {show: true, title: "save as image"}
                }
            },
            calculable : true,
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : false,
                    data : ['Mon.','Tue.','Wed.','Thu.','Fri.','Sat.','Sun.']
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [
                {
                    name:'Deal closed',
                    type:'line',
                    smooth:true,
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    data:[10, 12, 21, 54, 260, 830, 710]
                },
                {
                    name:'Pre-order',
                    type:'line',
                    smooth:true,
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    data:[30, 182, 434, 791, 390, 30, 10]
                },
                {
                    name:'Intention',
                    type:'line',
                    smooth:true,
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    data:[1320, 1132, 601, 234, 120, 90, 20]
                }
            ]
        };
        $scope.line4.options = {
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                data:['Email','Affiliate','Video Ads','Direct','Search']
            },
            toolbox: {
                show : true,
                feature : {
                    restore : {show: true, title: "restore"},
                    saveAsImage : {show: true, title: "save as image"}
                }
            },
            calculable : true,
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : false,
                    data : ['Mon.','Tue.','Wed.','Thu.','Fri.','Sat.','Sun.']
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [
                {
                    name:'Email',
                    type:'line',
                    stack: 'Sum',
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    data:[120, 132, 101, 134, 90, 230, 210]
                },
                {
                    name:'Affiliate',
                    type:'line',
                    stack: 'Sum',
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    data:[220, 182, 191, 234, 290, 330, 310]
                },
                {
                    name:'Video Ads',
                    type:'line',
                    stack: 'Sum',
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    data:[150, 232, 201, 154, 190, 330, 410]
                },
                {
                    name:'Direct',
                    type:'line',
                    stack: 'Sum',
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    data:[320, 332, 301, 334, 390, 330, 320]
                },
                {
                    name:'Search',
                    type:'line',
                    stack: 'Sum',
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    data:[820, 932, 901, 934, 1290, 1330, 1320]
                }
            ]
        };

        $scope.bar1.options = {
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                data:['Evaporation','Precipitation']
            },
            toolbox: {
                show : true,
                feature : {
                    restore : {show: true, title: "restore"},
                    saveAsImage : {show: true, title: "save as image"}
                }
            },
            calculable : true,
            xAxis : [
                {
                    type : 'category',
                    data : ['Jan.','Feb.','Mar.','Apr.','May','Jun.','Jul.','Aug.','Sep.','Oct.','Nov.','Dec.']
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [
                {
                    name:'Evaporation',
                    type:'bar',
                    data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
                    markPoint : {
                        data : [
                            {type : 'max', name: 'Max'},
                            {type : 'min', name: 'Min'}
                        ]
                    },
                    markLine : {
                        data : [
                            {type : 'average', name: 'Average'}
                        ]
                    }
                },
                {
                    name:'Precipitation',
                    type:'bar',
                    data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
                    markPoint : {
                        data : [
                            {name : 'Highest', value : 182.2, xAxis: 7, yAxis: 183, symbolSize:18},
                            {name : 'Lowest', value : 2.3, xAxis: 11, yAxis: 3}
                        ]
                    },
                    markLine : {
                        data : [
                            {type : 'average', name : 'Average'}
                        ]
                    }
                }
            ]
        };
        $scope.bar2.options = {
            tooltip : {
                trigger: 'axis',
                axisPointer : {
                    type : 'shadow'
                }
            },
            legend: {
                data:['Direct','Email','Affiliate','Video Ads','Search','Baidu','Google','Bing','Others']
            },
            calculable : true,
            xAxis : [
                {
                    type : 'category',
                    data : ['Mon.','Tue.','Wed.','Thu.','Fri.','Sat.','Sun.']
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [
                {
                    name:'Direct',
                    type:'bar',
                    data:[320, 332, 301, 334, 390, 330, 320]
                },
                {
                    name:'Email',
                    type:'bar',
                    stack: 'Ads',
                    data:[120, 132, 101, 134, 90, 230, 210]
                },
                {
                    name:'Affiliate',
                    type:'bar',
                    stack: 'Ads',
                    data:[220, 182, 191, 234, 290, 330, 310]
                },
                {
                    name:'Video Ads',
                    type:'bar',
                    stack: 'Ads',
                    data:[150, 232, 201, 154, 190, 330, 410]
                },
                {
                    name:'Search',
                    type:'bar',
                    data:[862, 1018, 964, 1026, 1679, 1600, 1570],
                    markLine : {
                        itemStyle:{
                            normal:{
                                lineStyle:{
                                    type: 'dashed'
                                }
                            }
                        },
                        data : [
                            [{type : 'min'}, {type : 'max'}]
                        ]
                    }
                },
                {
                    name:'Baidu',
                    type:'bar',
                    barWidth : 5,
                    stack: 'Search',
                    data:[620, 732, 701, 734, 1090, 1130, 1120]
                },
                {
                    name:'Google',
                    type:'bar',
                    stack: 'Search',
                    data:[120, 132, 101, 134, 290, 230, 220]
                },
                {
                    name:'Bing',
                    type:'bar',
                    stack: 'Search',
                    data:[60, 72, 71, 74, 190, 130, 110]
                },
                {
                    name:'Others',
                    type:'bar',
                    stack: 'Search',
                    data:[62, 82, 91, 84, 109, 110, 120]
                }
            ]
        };
        $scope.bar3.options = {
            title : {
                text: 'World Population',
                subtext: 'From the Internet'
            },
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                data:['2011', '2012']
            },
            toolbox: {
                show : true,
                feature : {
                    restore : {show: true, title: "restore"},
                    saveAsImage : {show: true, title: "save as image"}
                }
            },
            calculable : true,
            xAxis : [
                {
                    type : 'value',
                    boundaryGap : [0, 0.01]
                }
            ],
            yAxis : [
                {
                    type : 'category',
                    data : ['Brazil','Indonesia','USA','India','China','World Population (10k)']
                }
            ],
            series : [
                {
                    name:'2011',
                    type:'bar',
                    data:[18203, 23489, 29034, 104970, 131744, 630230]
                },
                {
                    name:'2012',
                    type:'bar',
                    data:[19325, 23438, 31000, 121594, 134141, 681807]
                }
            ]
        };
        $scope.bar4.options = {
            tooltip : {
                trigger: 'axis',
                axisPointer : {            
                    type : 'shadow'
                }
            },
            legend: {
                data:['Direct', 'Email','Affiliate','Video Ads','Search']
            },
            toolbox: {
                show : true,
                feature : {
                    restore : {show: true, title: "restore"},
                    saveAsImage : {show: true, title: "save as image"}
                }
            },
            calculable : true,
            xAxis : [
                {
                    type : 'value'
                }
            ],
            yAxis : [
                {
                    type : 'category',
                    data : ['Mon.','Tue.','Wed.','Thu.','Fri.','Sat.','Sun.']
                }
            ],
            series : [
                {
                    name:'Direct',
                    type:'bar',
                    stack: 'Sum',
                    itemStyle : { normal: {label : {show: true, position: 'insideRight'}}},
                    data:[320, 302, 301, 334, 390, 330, 320]
                },
                {
                    name:'Email',
                    type:'bar',
                    stack: 'Sum',
                    itemStyle : { normal: {label : {show: true, position: 'insideRight'}}},
                    data:[120, 132, 101, 134, 90, 230, 210]
                },
                {
                    name:'Affiliate',
                    type:'bar',
                    stack: 'Sum',
                    itemStyle : { normal: {label : {show: true, position: 'insideRight'}}},
                    data:[220, 182, 191, 234, 290, 330, 310]
                },
                {
                    name:'Video Ads',
                    type:'bar',
                    stack: 'Sum',
                    itemStyle : { normal: {label : {show: true, position: 'insideRight'}}},
                    data:[150, 212, 201, 154, 190, 330, 410]
                },
                {
                    name:'Search',
                    type:'bar',
                    stack: 'Sum',
                    itemStyle : { normal: {label : {show: true, position: 'insideRight'}}},
                    data:[820, 832, 901, 934, 1290, 1330, 1320]
                }
            ]
        };
        $scope.bar5.options = {
            tooltip : {
                trigger: 'axis',
                axisPointer : {         
                    type : 'shadow'
                }
            },
            legend: {
                data:['Profit', 'Cost', 'Income']
            },
            toolbox: {
                show : true,
                feature : {
                    restore : {show: true, title: "restore"},
                    saveAsImage : {show: true, title: "save as image"}
                }
            },
            calculable : true,
            xAxis : [
                {
                    type : 'value'
                }
            ],
            yAxis : [
                {
                    type : 'category',
                    axisTick : {show: false},
                    data : ['Mon.','Tue.','Wed.','Thu.','Fri.','Sat.','Sun.']
                }
            ],
            series : [
                {
                    name:'Profit',
                    type:'bar',
                    itemStyle : { normal: {label : {show: true, position: 'inside'}}},
                    data:[200, 170, 240, 244, 200, 220, 210]
                },
                {
                    name:'Income',
                    type:'bar',
                    stack: 'Sum',
                    barWidth : 5,
                    itemStyle: {normal: {
                        label : {show: true}
                    }},
                    data:[320, 302, 341, 374, 390, 450, 420]
                },
                {
                    name:'Cost',
                    type:'bar',
                    stack: 'Sum',
                    itemStyle: {normal: {
                        label : {show: true, position: 'left'}
                    }},
                    data:[-120, -132, -101, -134, -190, -230, -210]
                }
            ]
        };

        $scope.pie1.options = {
            title : {
                text: 'Traffic Source',
                x:'center'
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient : 'vertical',
                x : 'left',
                data:['Direct','Email','Affiliate','Video Ads','Search']
            },
            toolbox: {
                show : true,
                feature : {
                    restore : {show: true, title: "restore"},
                    saveAsImage : {show: true, title: "save as image"}
                }
            },
            calculable : true,
            series : [
                {
                    name:'Vist source',
                    type:'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    data:[
                        {value:335, name:'Direct'},
                        {value:310, name:'Email'},
                        {value:234, name:'Affiliate'},
                        {value:135, name:'Video Ads'},
                        {value:1548, name:'Search'}
                    ]
                }
            ]
        };
        $scope.pie2.options = {
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient : 'vertical',
                x : 'left',
                data:['Direct','Email','Affiliate','Video Ads','Search']
            },
            toolbox: {
                show : true,
                feature : {
                    restore : {show: true, title: "restore"},
                    saveAsImage : {show: true, title: "save as image"}
                }
            },
            calculable : true,
            series : [
                {
                    name:'Traffic source',
                    type:'pie',
                    radius : ['50%', '70%'],
                    itemStyle : {
                        normal : {
                            label : {
                                show : false
                            },
                            labelLine : {
                                show : false
                            }
                        },
                        emphasis : {
                            label : {
                                show : true,
                                position : 'center',
                                textStyle : {
                                    fontSize : '30',
                                    fontWeight : 'bold'
                                }
                            }
                        }
                    },
                    data:[
                        {value:335, name:'Direct'},
                        {value:310, name:'Email'},
                        {value:234, name:'Affiliate'},
                        {value:135, name:'Video Ads'},
                        {value:1548, name:'Search'}
                    ]
                }
            ]
        };
        $scope.pie4.options = {
            title : {
                text: 'Nightingale rose diagram',
                x:'center'
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                x : 'center',
                y : 'bottom',
                data:['rose1','rose2','rose3','rose4','rose5','rose6','rose7','rose8']
            },
            toolbox: {
                show : true,
                feature : {
                    restore : {show: true, title: "restore"},
                    saveAsImage : {show: true, title: "save as image"}
                }
            },
            calculable : true,
            series : [
                {
                    name:'Radius model',
                    type:'pie',
                    radius : [20, 110],
                    center : ['25%', 200],
                    roseType : 'radius',
                    width: '40%',       // for funnel
                    max: 40,            // for funnel
                    itemStyle : {
                        normal : {
                            label : {
                                show : false
                            },
                            labelLine : {
                                show : false
                            }
                        },
                        emphasis : {
                            label : {
                                show : true
                            },
                            labelLine : {
                                show : true
                            }
                        }
                    },
                    data:[
                        {value:10, name:'rose1'},
                        {value:5, name:'rose2'},
                        {value:15, name:'rose3'},
                        {value:25, name:'rose4'},
                        {value:20, name:'rose5'},
                        {value:35, name:'rose6'},
                        {value:30, name:'rose7'},
                        {value:40, name:'rose8'}
                    ]
                },
                {
                    name:'Area model',
                    type:'pie',
                    radius : [30, 110],
                    center : ['75%', 200],
                    roseType : 'area',
                    x: '50%',               // for funnel
                    max: 40,                // for funnel
                    sort : 'ascending',     // for funnel
                    data:[
                        {value:10, name:'rose1'},
                        {value:5, name:'rose2'},
                        {value:15, name:'rose3'},
                        {value:25, name:'rose4'},
                        {value:20, name:'rose5'},
                        {value:35, name:'rose6'},
                        {value:30, name:'rose7'},
                        {value:40, name:'rose8'}
                    ]
                }
            ]

        };

        $scope.scatter1.options = {
            title : {
                text: 'Height and weight distribution',
                subtext: 'Data: Heinz  2003'
            },
            tooltip : {
                trigger: 'axis',
                showDelay : 0,
                formatter : function (params) {
                    if (params.value.length > 1) {
                        return params.seriesName + ' :<br/>'
                           + params.value[0] + 'cm ' 
                           + params.value[1] + 'kg ';
                    }
                    else {
                        return params.seriesName + ' :<br/>'
                           + params.name + ' : '
                           + params.value + 'kg ';
                    }
                },  
                axisPointer:{
                    show: true,
                    type : 'cross',
                    lineStyle: {
                        type : 'dashed',
                        width : 1
                    }
                }
            },
            legend: {
                data:['Femail','Male']
            },
            toolbox: {
                show : true,
                feature : {
                    restore : {show: true, title: "restore"},
                    saveAsImage : {show: true, title: "save as image"}
                }
            },
            xAxis : [
                {
                    type : 'value',
                    scale:true,
                    axisLabel : {
                        formatter: '{value} cm'
                    }
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    scale:true,
                    axisLabel : {
                        formatter: '{value} kg'
                    }
                }
            ],
            series : [
                {
                    name:'Femail',
                    type:'scatter',
                    data: [[161.2, 51.6], [167.5, 59.0], [159.5, 49.2], [157.0, 63.0], [155.8, 53.6],
                        [170.0, 59.0], [159.1, 47.6], [166.0, 69.8], [176.2, 66.8], [160.2, 75.2],
                        [172.5, 55.2], [170.9, 54.2], [172.9, 62.5], [153.4, 42.0], [160.0, 50.0],
                        [147.2, 49.8], [168.2, 49.2], [175.0, 73.2], [157.0, 47.8], [167.6, 68.8],
                        [159.5, 50.6], [175.0, 82.5], [166.8, 57.2], [176.5, 87.8], [170.2, 72.8],
                        [174.0, 54.5], [173.0, 59.8], [179.9, 67.3], [170.5, 67.8], [160.0, 47.0],
                        [154.4, 46.2], [162.0, 55.0], [176.5, 83.0], [160.0, 54.4], [152.0, 45.8],
                        [162.1, 53.6], [170.0, 73.2], [160.2, 52.1], [161.3, 67.9], [166.4, 56.6],
                        [168.9, 62.3], [163.8, 58.5], [167.6, 54.5], [160.0, 50.2], [161.3, 60.3],
                        [167.6, 58.3], [165.1, 56.2], [160.0, 50.2], [170.0, 72.9], [157.5, 59.8],
                        [167.6, 61.0], [160.7, 69.1], [163.2, 55.9], [152.4, 46.5], [157.5, 54.3],
                        [168.3, 54.8], [180.3, 60.7], [165.5, 60.0], [165.0, 62.0], [164.5, 60.3],
                        [156.0, 52.7], [160.0, 74.3], [163.0, 62.0], [165.7, 73.1], [161.0, 80.0],
                        [162.0, 54.7], [166.0, 53.2], [174.0, 75.7], [172.7, 61.1], [167.6, 55.7],
                        [151.1, 48.7], [164.5, 52.3], [163.5, 50.0], [152.0, 59.3], [169.0, 62.5],
                        [164.0, 55.7], [161.2, 54.8], [155.0, 45.9], [170.0, 70.6], [176.2, 67.2],
                        [170.0, 69.4], [162.5, 58.2], [170.3, 64.8], [164.1, 71.6], [169.5, 52.8],
                        [163.2, 59.8], [154.5, 49.0], [159.8, 50.0], [173.2, 69.2], [170.0, 55.9],
                        [161.4, 63.4], [169.0, 58.2], [166.2, 58.6], [159.4, 45.7], [162.5, 52.2],
                        [159.0, 48.6], [162.8, 57.8], [159.0, 55.6], [179.8, 66.8], [162.9, 59.4],
                        [161.0, 53.6], [151.1, 73.2], [168.2, 53.4], [168.9, 69.0], [173.2, 58.4],
                        [171.8, 56.2], [178.0, 70.6], [164.3, 59.8], [163.0, 72.0], [168.5, 65.2],
                        [166.8, 56.6], [172.7, 105.2], [163.5, 51.8], [169.4, 63.4], [167.8, 59.0],
                        [159.5, 47.6], [167.6, 63.0], [161.2, 55.2], [160.0, 45.0], [163.2, 54.0],
                        [162.2, 50.2], [161.3, 60.2], [149.5, 44.8], [157.5, 58.8], [163.2, 56.4],
                        [172.7, 62.0], [155.0, 49.2], [156.5, 67.2], [164.0, 53.8], [160.9, 54.4],
                        [162.8, 58.0], [167.0, 59.8], [160.0, 54.8], [160.0, 43.2], [168.9, 60.5],
                        [158.2, 46.4], [156.0, 64.4], [160.0, 48.8], [167.1, 62.2], [158.0, 55.5],
                        [167.6, 57.8], [156.0, 54.6], [162.1, 59.2], [173.4, 52.7], [159.8, 53.2],
                        [170.5, 64.5], [159.2, 51.8], [157.5, 56.0], [161.3, 63.6], [162.6, 63.2],
                        [160.0, 59.5], [168.9, 56.8], [165.1, 64.1], [162.6, 50.0], [165.1, 72.3],
                        [166.4, 55.0], [160.0, 55.9], [152.4, 60.4], [170.2, 69.1], [162.6, 84.5],
                        [170.2, 55.9], [158.8, 55.5], [172.7, 69.5], [167.6, 76.4], [162.6, 61.4],
                        [167.6, 65.9], [156.2, 58.6], [175.2, 66.8], [172.1, 56.6], [162.6, 58.6],
                        [160.0, 55.9], [165.1, 59.1], [182.9, 81.8], [166.4, 70.7], [165.1, 56.8],
                        [177.8, 60.0], [165.1, 58.2], [175.3, 72.7], [154.9, 54.1], [158.8, 49.1],
                        [172.7, 75.9], [168.9, 55.0], [161.3, 57.3], [167.6, 55.0], [165.1, 65.5],
                        [175.3, 65.5], [157.5, 48.6], [163.8, 58.6], [167.6, 63.6], [165.1, 55.2],
                        [165.1, 62.7], [168.9, 56.6], [162.6, 53.9], [164.5, 63.2], [176.5, 73.6],
                        [168.9, 62.0], [175.3, 63.6], [159.4, 53.2], [160.0, 53.4], [170.2, 55.0],
                        [162.6, 70.5], [167.6, 54.5], [162.6, 54.5], [160.7, 55.9], [160.0, 59.0],
                        [157.5, 63.6], [162.6, 54.5], [152.4, 47.3], [170.2, 67.7], [165.1, 80.9],
                        [172.7, 70.5], [165.1, 60.9], [170.2, 63.6], [170.2, 54.5], [170.2, 59.1],
                        [161.3, 70.5], [167.6, 52.7], [167.6, 62.7], [165.1, 86.3], [162.6, 66.4],
                        [152.4, 67.3], [168.9, 63.0], [170.2, 73.6], [175.2, 62.3], [175.2, 57.7],
                        [160.0, 55.4], [165.1, 104.1], [174.0, 55.5], [170.2, 77.3], [160.0, 80.5],
                        [167.6, 64.5], [167.6, 72.3], [167.6, 61.4], [154.9, 58.2], [162.6, 81.8],
                        [175.3, 63.6], [171.4, 53.4], [157.5, 54.5], [165.1, 53.6], [160.0, 60.0],
                        [174.0, 73.6], [162.6, 61.4], [174.0, 55.5], [162.6, 63.6], [161.3, 60.9],
                        [156.2, 60.0], [149.9, 46.8], [169.5, 57.3], [160.0, 64.1], [175.3, 63.6],
                        [169.5, 67.3], [160.0, 75.5], [172.7, 68.2], [162.6, 61.4], [157.5, 76.8],
                        [176.5, 71.8], [164.4, 55.5], [160.7, 48.6], [174.0, 66.4], [163.8, 67.3]
                    ],
                    markPoint : {
                        data : [
                            {type : 'max', name: 'Max'},
                            {type : 'min', name: 'Min'}
                        ]
                    },
                    markLine : {
                        data : [
                            {type : 'average', name: 'Average'}
                        ]
                    }
                },
                {
                    name:'Male',
                    type:'scatter',
                    data: [[174.0, 65.6], [175.3, 71.8], [193.5, 80.7], [186.5, 72.6], [187.2, 78.8],
                        [181.5, 74.8], [184.0, 86.4], [184.5, 78.4], [175.0, 62.0], [184.0, 81.6],
                        [180.0, 76.6], [177.8, 83.6], [192.0, 90.0], [176.0, 74.6], [174.0, 71.0],
                        [184.0, 79.6], [192.7, 93.8], [171.5, 70.0], [173.0, 72.4], [176.0, 85.9],
                        [176.0, 78.8], [180.5, 77.8], [172.7, 66.2], [176.0, 86.4], [173.5, 81.8],
                        [178.0, 89.6], [180.3, 82.8], [180.3, 76.4], [164.5, 63.2], [173.0, 60.9],
                        [183.5, 74.8], [175.5, 70.0], [188.0, 72.4], [189.2, 84.1], [172.8, 69.1],
                        [170.0, 59.5], [182.0, 67.2], [170.0, 61.3], [177.8, 68.6], [184.2, 80.1],
                        [186.7, 87.8], [171.4, 84.7], [172.7, 73.4], [175.3, 72.1], [180.3, 82.6],
                        [182.9, 88.7], [188.0, 84.1], [177.2, 94.1], [172.1, 74.9], [167.0, 59.1],
                        [169.5, 75.6], [174.0, 86.2], [172.7, 75.3], [182.2, 87.1], [164.1, 55.2],
                        [163.0, 57.0], [171.5, 61.4], [184.2, 76.8], [174.0, 86.8], [174.0, 72.2],
                        [177.0, 71.6], [186.0, 84.8], [167.0, 68.2], [171.8, 66.1], [182.0, 72.0],
                        [167.0, 64.6], [177.8, 74.8], [164.5, 70.0], [192.0, 101.6], [175.5, 63.2],
                        [171.2, 79.1], [181.6, 78.9], [167.4, 67.7], [181.1, 66.0], [177.0, 68.2],
                        [174.5, 63.9], [177.5, 72.0], [170.5, 56.8], [182.4, 74.5], [197.1, 90.9],
                        [180.1, 93.0], [175.5, 80.9], [180.6, 72.7], [184.4, 68.0], [175.5, 70.9],
                        [180.6, 72.5], [177.0, 72.5], [177.1, 83.4], [181.6, 75.5], [176.5, 73.0],
                        [175.0, 70.2], [174.0, 73.4], [165.1, 70.5], [177.0, 68.9], [192.0, 102.3],
                        [176.5, 68.4], [169.4, 65.9], [182.1, 75.7], [179.8, 84.5], [175.3, 87.7],
                        [184.9, 86.4], [177.3, 73.2], [167.4, 53.9], [178.1, 72.0], [168.9, 55.5],
                        [157.2, 58.4], [180.3, 83.2], [170.2, 72.7], [177.8, 64.1], [172.7, 72.3],
                        [165.1, 65.0], [186.7, 86.4], [165.1, 65.0], [174.0, 88.6], [175.3, 84.1],
                        [185.4, 66.8], [177.8, 75.5], [180.3, 93.2], [180.3, 82.7], [177.8, 58.0],
                        [177.8, 79.5], [177.8, 78.6], [177.8, 71.8], [177.8, 116.4], [163.8, 72.2],
                        [188.0, 83.6], [198.1, 85.5], [175.3, 90.9], [166.4, 85.9], [190.5, 89.1],
                        [166.4, 75.0], [177.8, 77.7], [179.7, 86.4], [172.7, 90.9], [190.5, 73.6],
                        [185.4, 76.4], [168.9, 69.1], [167.6, 84.5], [175.3, 64.5], [170.2, 69.1],
                        [190.5, 108.6], [177.8, 86.4], [190.5, 80.9], [177.8, 87.7], [184.2, 94.5],
                        [176.5, 80.2], [177.8, 72.0], [180.3, 71.4], [171.4, 72.7], [172.7, 84.1],
                        [172.7, 76.8], [177.8, 63.6], [177.8, 80.9], [182.9, 80.9], [170.2, 85.5],
                        [167.6, 68.6], [175.3, 67.7], [165.1, 66.4], [185.4, 102.3], [181.6, 70.5],
                        [172.7, 95.9], [190.5, 84.1], [179.1, 87.3], [175.3, 71.8], [170.2, 65.9],
                        [193.0, 95.9], [171.4, 91.4], [177.8, 81.8], [177.8, 96.8], [167.6, 69.1],
                        [167.6, 82.7], [180.3, 75.5], [182.9, 79.5], [176.5, 73.6], [186.7, 91.8],
                        [188.0, 84.1], [188.0, 85.9], [177.8, 81.8], [174.0, 82.5], [177.8, 80.5],
                        [171.4, 70.0], [185.4, 81.8], [185.4, 84.1], [188.0, 90.5], [188.0, 91.4],
                        [182.9, 89.1], [176.5, 85.0], [175.3, 69.1], [175.3, 73.6], [188.0, 80.5],
                        [188.0, 82.7], [175.3, 86.4], [170.5, 67.7], [179.1, 92.7], [177.8, 93.6],
                        [175.3, 70.9], [182.9, 75.0], [170.8, 93.2], [188.0, 93.2], [180.3, 77.7],
                        [177.8, 61.4], [185.4, 94.1], [168.9, 75.0], [185.4, 83.6], [180.3, 85.5],
                        [174.0, 73.9], [167.6, 66.8], [182.9, 87.3], [160.0, 72.3], [180.3, 88.6],
                        [167.6, 75.5], [186.7, 101.4], [175.3, 91.1], [175.3, 67.3], [175.9, 77.7],
                        [175.3, 81.8], [179.1, 75.5], [181.6, 84.5], [177.8, 76.6], [182.9, 85.0],
                        [177.8, 102.5], [184.2, 77.3], [179.1, 71.8], [176.5, 87.9], [188.0, 94.3],
                        [174.0, 70.9], [167.6, 64.5], [170.2, 77.3], [167.6, 72.3], [188.0, 87.3],
                        [174.0, 80.0], [176.5, 82.3], [180.3, 73.6], [167.6, 74.1], [188.0, 85.9],
                        [180.3, 73.2], [167.6, 76.3], [183.0, 65.9], [183.0, 90.9], [179.1, 89.1],
                        [170.2, 62.3], [177.8, 82.7], [179.1, 79.1], [190.5, 98.2], [177.8, 84.1],
                        [180.3, 83.2], [180.3, 83.2]
                    ],
                    markPoint : {
                        data : [
                            {type : 'max', name: 'Max'},
                            {type : 'min', name: 'Min'}
                        ]
                    },
                    markLine : {
                        data : [
                            {type : 'average', name: 'Average'}
                        ]
                    }
                }
            ]
        };
        function random(){
            var r = Math.round(Math.random() * 100);
            return (r * (r % 2 == 0 ? 1 : -1));
        }
        function randomDataArray() {
            var d = [];
            var len = 100;
            while (len--) {
                d.push([
                    random(),
                    random(),
                    Math.abs(random()),
                ]);
            }
            return d;
        }        
        $scope.scatter2.options = {
            tooltip : {
                trigger: 'axis',
                showDelay : 0,
                axisPointer:{
                    show: true,
                    type : 'cross',
                    lineStyle: {
                        type : 'dashed',
                        width : 1
                    }
                }
            },
            legend: {
                data:['scatter1','scatter2']
            },
            toolbox: {
                show : true,
                feature : {
                    restore : {show: true, title: "restore"},
                    saveAsImage : {show: true, title: "save as image"}
                }
            },
            xAxis : [
                {
                    type : 'value',
                    splitNumber: 4,
                    scale: true
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    splitNumber: 4,
                    scale: true
                }
            ],
            series : [
                {
                    name:'scatter1',
                    type:'scatter',
                    symbolSize: function (value){
                        return Math.round(value[2] / 5);
                    },
                    data: randomDataArray()
                },
                {
                    name:'scatter2',
                    type:'scatter',
                    symbolSize: function (value){
                        return Math.round(value[2] / 5);
                    },
                    data: randomDataArray()
                }
            ]
        };

        $scope.radar1.options = {
            title : {
                text: 'Budget vs spending'
            },
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                orient : 'vertical',
                x : 'right',
                y : 'bottom',
                data:['Allocated Budget','Actual Spending']
            },
            toolbox: {
                show : true,
                feature : {
                    restore : {show: true, title: "restore"},
                    saveAsImage : {show: true, title: "save as image"}
                }
            },
            polar : [
               {
                   indicator : [
                       { text: 'sales', max: 6000},
                       { text: 'dministration', max: 16000},
                       { text: 'Information Techology', max: 30000},
                       { text: 'Customer Support', max: 38000},
                       { text: 'Development', max: 52000},
                       { text: 'Marketing', max: 25000}
                    ]
                }
            ],
            calculable : true,
            series : [
                {
                    name: 'Budget vs spending',
                    type: 'radar',
                    data : [
                        {
                            value : [4300, 10000, 28000, 35000, 50000, 19000],
                            name : 'Allocated Budget'
                        },
                         {
                            value : [5000, 14000, 28000, 31000, 42000, 21000],
                            name : 'Actual Spending'
                        }
                    ]
                }
            ]
        };
        $scope.radar2.options = {
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                x : 'center',
                data:['Ronaldo','Andriy Shevchenko']
            },
            toolbox: {
                show : true,
                feature : {
                    restore : {show: true, title: "restore"},
                    saveAsImage : {show: true, title: "save as image"}
                }
            },
            calculable : true,
            polar : [
                {
                    indicator : [
                        {text : 'Attack', max  : 100},
                        {text : 'Guard', max  : 100},
                        {text : 'Physical', max  : 100},
                        {text : 'Speed', max  : 100},
                        {text : 'Strength', max  : 100},
                        {text : 'Skill', max  : 100}
                    ],
                    radius : 130
                }
            ],
            series : [
                {
                    name: 'Full of live data',
                    type: 'radar',
                    itemStyle: {
                        normal: {
                            areaStyle: {
                                type: 'default'
                            }
                        }
                    },
                    data : [
                        {
                            value : [97, 42, 88, 94, 90, 86],
                            name : 'Andriy Shevchenko'
                        },
                        {
                            value : [97, 32, 74, 95, 88, 92],
                            name : 'Ronaldo'
                        }
                    ]
                }
            ]
        };

        $scope.gauge1.options = {
            tooltip : {
                formatter: "{a} <br/>{b} : {c}%"
            },
            toolbox: {
                show : true,
                feature : {
                    restore : {show: true, title: "restore"},
                    saveAsImage : {show: true, title: "save as image"}
                }
            },
            series : [
                {
                    name:'Business metric',
                    type:'gauge',
                    detail : {formatter:'{value}%'},
                    data:[{value: 50, name: 'Completion'}]
                }
            ]
        };



        $scope.chord1.options = {
            title : {
                text: 'Test Data',
                subtext: 'From d3.js',
                x:'right',
                y:'bottom'
            },
            tooltip : {
                trigger: 'item',
                formatter: function (params) {
                    if (params.indicator2) { // is edge
                        return params.value.weight;
                    } else {// is node
                        return params.name
                    }
                }
            },
            toolbox: {
                show : true,
                feature : {
                    restore : {show: true, title: "restore"},
                    saveAsImage : {show: true, title: "save as image"}
                }
            },
            legend: {
                x: 'left',
                data:['group1','group2', 'group3', 'group4']
            },
            series : [
                {
                    type:'chord',
                    sort : 'ascending',
                    sortSub : 'descending',
                    showScale : true,
                    showScaleText : true,
                    data : [
                        {name : 'group1'},
                        {name : 'group2'},
                        {name : 'group3'},
                        {name : 'group4'}
                    ],
                    itemStyle : {
                        normal : {
                            label : {
                                show : false
                            }
                        }
                    },
                    matrix : [
                        [11975,  5871, 8916, 2868],
                        [ 1951, 10048, 2060, 6171],
                        [ 8010, 16145, 8090, 8045],
                        [ 1013,   990,  940, 6907]
                    ]
                }
            ]
        };

        $scope.funnel1.options = {
            title : {
                text: 'Funnel'
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c}%"
            },
            toolbox: {
                show : true,
                feature : {
                    restore : {show: true, title: "restore"},
                    saveAsImage : {show: true, title: "save as image"}
                }
            },
            legend: {
                data : ['Display','Click','Vist','Contact','Order']
            },
            calculable : true,
            series : [
                {
                    name:'Funnel',
                    type:'funnel',
                    width: '40%',
                    data:[
                        {value:60, name:'Vist'},
                        {value:40, name:'Contact'},
                        {value:20, name:'Order'},
                        {value:80, name:'Click'},
                        {value:100, name:'Display'}
                    ]
                },
                {
                    name:'Pyramid',
                    type:'funnel',
                    x : '50%',
                    sort : 'ascending',
                    itemStyle: {
                        normal: {
                            label: {
                                position: 'left'
                            }
                        }
                    },
                    data:[
                        {value:60, name:'Vist'},
                        {value:40, name:'Contact'},
                        {value:20, name:'Order'},
                        {value:80, name:'Click'},
                        {value:100, name:'Display'}
                    ]
                }
            ]
        };
    }    
})(); 

;
(function () {
    'use strict';

    angular.module('app')/*
        .config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
            console.log("hola mundo");//<div></div>
            cfpLoadingBarProvider.spinnerTemplate = '<img src="images/spinners/spinner01.gif">';
        }])*/
        .controller('AppCtrl', [ '$scope', '$rootScope', '$route', '$document', '$state', '$stateParams', '$http', AppCtrl]); // overall control;

    function AppCtrl($scope, $rootScope, $route, $document, $state, $stateParams, $http) {

        /*      
      if(window.performance) {
           if(performance.navigation.type == 1) {
                    $state.go('login');    
            }
      }   
        */
      var token = window.sessionStorage.getItem("token");

      var date = new Date();
      var year = date.getFullYear();

      $scope.main = {
          brand: config.appName,
          //name: "",
          year: year
      };      

        $scope.pageTransitionOpts = [
            {
                name: 'Fade up',
                "class": 'animate-fade-up'
            }, {
                name: 'Scale up',
                "class": 'ainmate-scale-up'
            }, {
                name: 'Slide in from right',
                "class": 'ainmate-slide-in-right'
            }, {
                name: 'Flip Y',
                "class": 'animate-flip-y'
            }
        ];

        $scope.admin = {
            layout: 'wide',                                 // 'boxed', 'wide'
            menu: 'vertical',                               // 'horizontal', 'vertical', 'collapsed'
            fixedHeader: true,                              // true, false
            fixedSidebar: true,                             // true, false
            pageTransition: $scope.pageTransitionOpts[0],   // unlimited
            skin: '11'                                      // 11,12,13,14,15,16; 21,22,23,24,25,26; 31,32,33,34,35,36
        };

        $scope.$watch('admin', function(newVal, oldVal) {
            if (newVal.menu === 'horizontal' && oldVal.menu === 'vertical') {
                $rootScope.$broadcast('nav:reset');
            }
            if (newVal.fixedHeader === false && newVal.fixedSidebar === true) {
                if (oldVal.fixedHeader === false && oldVal.fixedSidebar === false) {
                    $scope.admin.fixedHeader = true;
                    $scope.admin.fixedSidebar = true;
                }
                if (oldVal.fixedHeader === true && oldVal.fixedSidebar === true) {
                    $scope.admin.fixedHeader = false;
                    $scope.admin.fixedSidebar = false;
                }
            }
            if (newVal.fixedSidebar === true) {
                $scope.admin.fixedHeader = true;
            }
            if (newVal.fixedHeader === false) {
                $scope.admin.fixedSidebar = false;
            }
        }, true);

        $scope.color = {
            primary:        '#5B90BF',
            success:        '#A3BE8C',
            info:           '#7FABD2',
            infoAlt:        '#B48EAD',
            warning:        '#EBCB8B',
            danger:         '#BF616A',
            gray:           '#DCDCDC'
        };

        $rootScope.$on("$routeChangeSuccess", function (event, currentRoute, previousRoute) {
            $document.scrollTo(0, 0);
        });
    }

})();

;
(function () {
    'use strict';

    angular.module('app')
    .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
        var routes, setRoutes;

        routes = [ 
                'ventas/ventas', 'ventas/asociar-subsets-campanas', 'ventas/campana-nueva', 'ventas/campanas', 'ventas/clientes', 'ventas/contratos', 'ventas/llamados', 'ventas/planes',
                'ventas/carga-campanas', 'ventas/campanas-asignadas', 'ventas/detalle-campanas-asignadas', 'ventas/campana-nueva',
                'ventas/carga-contratos', 'ventas/tabla-contratos', 'ventas/tabla-campanas', 'ventas/upload', 
                'callcenter/pantalla-operador', 
                'servicios/campanas', 'servicios/casos', 'servicios/contactos', 'servicios/planes', 'servicios/productos', 'servicios/servicios', 
                'seguridad/seguridad ', 
                'calidad/calidad', 
                'perfiles/perfiles',
                'main/aplicaciones',
                'import/mapeo-datos', 'import/importador-campanas',
                'settings/administracion', 'settings/sincronizaciones',
                'clientes/tabla-clientes',
                'crm/asignacion/asignacion',
                'page/signin'
                ]

                setRoutes = function(route) {
                    var config, url;
                    url = '/' + route;
                    config = {
                        templateUrl: 'app/' + route + '.html'
                    };
                    $routeProvider.when(url, config);
                    return $routeProvider;
                };
                /*
        routes = [ 
                'page/signin'
                'gestor-campanas/asignacion', 
                'gestor-campanas/impo-db', 
                'gestor-campanas/mapeo-db',
                'operacion/venta',
                'startup-campana/alta-campana',
                'startup-campana/alta-cliente',
                'startup-campana/alta-contrato'   
                ]

                
                setRoutes = function(route) {
                    var config, url;
                    url = '/' + route;
                    config = {
                        templateUrl: 'app/crm' + route + '.html'
                    };
                    $routeProvider.when(url, config);
                    return $routeProvider;
                };
               */ 
                routes.forEach(function(route) {
                    return setRoutes(route);
                });

                $routeProvider
                .when('/', {redirectTo: 'page/signin'})
                .when('/404', {templateUrl: 'app/page/404.html'})
                .otherwise({ redirectTo: '/404'});

            }]
            );

})();

;
(function () {

    angular.module('app.i18n', ['pascalprecht.translate'])
        .config(['$translateProvider', i18nConfig])
        .controller('LangCtrl', ['$scope', '$translate', LangCtrl]);

        // English, Español, 日本語, 中文, Deutsch, français, Italiano, Portugal, Русский язык, 한국어
        // Note: Used on Header, Sidebar, Footer, Dashboard
        // English:          EN-US
        // Spanish:          Español ES-ES
        // Chinese:          简体中文 ZH-CN
        // Chinese:          繁体中文 ZH-TW
        // French:           français FR-FR

        // Not used:
        // Portugal:         Portugal PT-BR
        // Russian:          Русский язык RU-RU
        // German:           Deutsch DE-DE
        // Japanese:         日本語 JA-JP
        // Italian:          Italiano IT-IT
        // Korean:           한국어 KO-KR


        function i18nConfig($translateProvider) {

            $translateProvider.useStaticFilesLoader({
                prefix: 'i18n/',
                suffix: '.json'
            });

            $translateProvider.preferredLanguage('en');
            $translateProvider.useSanitizeValueStrategy(null);
        }


        function LangCtrl($scope, $translate) {
            $scope.lang = 'English';

            $scope.setLang = function(lang) {
                switch (lang) {
                    case 'English':
                        $translate.use('en');
                        break;
                    case 'Español':
                        $translate.use('es');
                        break;
                    case '中文':
                        $translate.use('zh');
                        break;
                    case '日本語':
                        $translate.use('ja');
                        break;
                    case 'Portugal':
                        $translate.use('pt');
                        break;
                    case 'Русский язык':
                        $translate.use('ru');
                        break;
                }
                return $scope.lang = lang;
            };

            $scope.getFlag = function() {
                var lang;
                lang = $scope.lang;
                switch (lang) {
                    case 'English':
                        return 'flags-american';
                        break;
                    case 'Español':
                        return 'flags-spain';
                        break;
                    case '中文':
                        return 'flags-china';
                        break;
                    case 'Portugal':
                        return 'flags-portugal';
                        break;
                    case '日本語':
                        return 'flags-japan';
                        break;
                    case 'Русский язык':
                        return 'flags-russia';
                        break;
                }
            };

        }

})(); 

;
(function () {
    'use strict';

    angular.module('app')
        .controller('DashboardCtrl', ['$scope', '$state', '$stateParams', DashboardCtrl])

    function DashboardCtrl($scope, $state, $stateParams) {
        // info #6BBCD7 107,188,215
        // success #81CA80 129,202,128

        $scope.pie1 = {};
        $scope.pie1.options = {
            animation: true,
            title : {
                text: 'Traffic Source',
                x:'left'
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            calculable : true,
            series : [
                {
                    name:'Vist source',
                    type:'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    data:[
                        {
                            value:335,
                            name:'Direct',
                            itemStyle:{                                
                                normal:{
                                    color: $scope.color.success,
                                    label: {
                                        show: true,
                                        textStyle: {
                                            color: $scope.color.success
                                        }
                                    },
                                    labelLine : {
                                        show: true,
                                        lineStyle: {
                                            color: $scope.color.success
                                        }
                                    }                                    
                                }
                            }
                        }, {
                            value:310,
                            name:'Email',
                            itemStyle:{
                                normal:{
                                    color: $scope.color.infoAlt,
                                    label: {
                                        show: true,
                                        textStyle: {
                                            color: $scope.color.infoAlt
                                        }
                                    },
                                    labelLine : {
                                        show: true,
                                        lineStyle: {
                                            color: $scope.color.infoAlt
                                        }
                                    }
                                }
                            }                            
                        },{
                            value:135,
                            name:'Video Ads',
                            itemStyle:{
                                normal:{
                                    color: $scope.color.warning,
                                    label: {
                                        show: true,
                                        textStyle: {
                                            color: $scope.color.warning
                                        }
                                    },
                                    labelLine : {
                                        show: true,
                                        lineStyle: {
                                            color: $scope.color.warning
                                        }
                                    }
                                }
                            } 
                        }, {
                            value:1548,
                            name:'Search',
                            itemStyle:{
                                normal:{
                                    color: $scope.color.info,
                                    label: {
                                        show: true,
                                        textStyle: {
                                            color: $scope.color.info
                                        }
                                    },
                                    labelLine : {
                                        show: true,
                                        lineStyle: {
                                            color: $scope.color.info
                                        }
                                    }
                                }
                            } 
                        }
                    ]
                }
            ]
        };

        function random(){
            var r = Math.round(Math.random() * 100);
            return (r * (r % 2 == 0 ? 1 : -1));
        }
        function randomDataArray() {
            var d = [];
            var len = 100;
            while (len--) {
                d.push([
                    random(),
                    random(),
                    Math.abs(random()),
                ]);
            }
            return d;
        }   
        $scope.scatter2 = {};
        $scope.scatter2.options = {
            tooltip : {
                trigger: 'axis',
                showDelay : 0,
                axisPointer:{
                    show: true,
                    type : 'cross',
                    lineStyle: {
                        type : 'dashed',
                        width : 1
                    }
                }
            },
            legend: {
                data:['scatter1','scatter2']
            },
            xAxis : [
                {
                    type : 'value',
                    splitNumber: 4,
                    scale: true
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    splitNumber: 4,
                    scale: true
                }
            ],
            series : [
                {
                    name:'scatter1',
                    type:'scatter',
                    symbolSize: function (value){
                        return Math.round(value[2] / 5);
                    },
                    itemStyle: {
                        normal: {
                            color: 'rgba(107,188,215,.5)'
                        }
                    },
                    data: randomDataArray()
                },
                {
                    name:'scatter2',
                    type:'scatter',
                    symbolSize: function (value){
                        return Math.round(value[2] / 5);
                    },
                    itemStyle: {
                        normal: {
                            color: 'rgba(129,202,128,.5)'
                        }
                    },                    
                    data: randomDataArray()
                }
            ]            
        }

    }


})(); 
;
(function () {
    'use strict';

    // Dependencies: jQuery, related jQuery plugins

    angular.module('app.ui.form')
        .controller('TagsDemoCtrl', ['$scope', TagsDemoCtrl])
        .controller('DatepickerDemoCtrl', ['$scope', DatepickerDemoCtrl])
        .controller('TimepickerDemoCtrl', ['$scope', TimepickerDemoCtrl])
        .controller('TypeaheadCtrl', ['$scope', TypeaheadCtrl])
        .controller('RatingDemoCtrl', ['$scope', RatingDemoCtrl]);

    function TagsDemoCtrl($scope) {
        $scope.tags = ['foo', 'bar'];
    }

    function DatepickerDemoCtrl ($scope) {
        $scope.today = function() {
            $scope.dt = new Date();
        };
        $scope.today();

        $scope.clear = function() {
            $scope.dt = null;
        };

        // Disable weekend selection
        $scope.disabled = function(date, mode) {
            return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
        };

        $scope.toggleMin = function() {
            $scope.minDate = $scope.minDate ? null : new Date();
        };

        $scope.toggleMin();
        $scope.maxDate = new Date(2020, 5, 22);

        $scope.open1 = function() {
            $scope.popup1.opened = true;
        };

        $scope.open2 = function() {
            $scope.popup2.opened = true;
        };

        $scope.setDate = function(year, month, day) {
            $scope.dt = new Date(year, month, day);
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.altInputFormats = ['M!/d!/yyyy'];

        $scope.popup1 = {
            opened: false
        };

        $scope.popup2 = {
            opened: false
        };

        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        var afterTomorrow = new Date();
        afterTomorrow.setDate(tomorrow.getDate() + 1);
        $scope.events =
            [
                {
                    date: tomorrow,
                    status: 'full'
                },
                {
                    date: afterTomorrow,
                    status: 'partially'
                }
            ];

        $scope.getDayClass = function(date, mode) {
            if (mode === 'day') {
                var dayToCheck = new Date(date).setHours(0,0,0,0);

                for (var i = 0; i < $scope.events.length; i++) {
                    var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

                    if (dayToCheck === currentDay) {
                        return $scope.events[i].status;
                    }
                }
            }

            return '';
        };
    }

    function TimepickerDemoCtrl($scope) {
        $scope.mytime = new Date();

        $scope.hstep = 1;

        $scope.mstep = 15;

        $scope.options = {
            hstep: [1, 2, 3],
            mstep: [1, 5, 10, 15, 25, 30]
        };

        $scope.ismeridian = true;

        $scope.toggleMode = function() {
            return $scope.ismeridian = !$scope.ismeridian;
        };

        $scope.update = function() {
            var d;
            d = new Date();
            d.setHours(14);
            d.setMinutes(0);
            return $scope.mytime = d;
        };

        $scope.changed = function() {
            return console.log('Time changed to: ' + $scope.mytime);
        };

        $scope.clear = function() {
            return $scope.mytime = null;
        };

    }


    function TypeaheadCtrl($scope) {
        $scope.selected = undefined;
        $scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
    }

    function RatingDemoCtrl($scope) {
        $scope.rate = 7;

        $scope.max = 10;

        $scope.isReadonly = false;

        $scope.hoveringOver = function(value) {
            $scope.overStar = value;
            return $scope.percent = 100 * (value / $scope.max);
        };

        $scope.ratingStates = [
            {
                stateOn: 'glyphicon-ok-sign',
                stateOff: 'glyphicon-ok-circle'
            }, {
                stateOn: 'glyphicon-star',
                stateOff: 'glyphicon-star-empty'
            }, {
                stateOn: 'glyphicon-heart',
                stateOff: 'glyphicon-ban-circle'
            }, {
                stateOn: 'glyphicon-heart'
            }, {
                stateOff: 'glyphicon-off'
            }
        ];

    }

})(); 
;
(function () {
    'use strict';

    angular.module('app.ui.form')
        .directive('uiRangeSlider', uiRangeSlider)
        .directive('uiFileUpload', uiFileUpload)
        .directive('uiWizardForm', uiWizardForm);

    // Dependency: http://www.eyecon.ro/bootstrap-slider/ OR https://github.com/seiyria/bootstrap-slider
    function uiRangeSlider() {
        return {
            restrict: 'A',
            link: function(scope, ele) {
                ele.slider();
            }            
        }
    }
    
    // Dependency: https://github.com/grevory/bootstrap-file-input
    function uiFileUpload() {
        return {
            restrict: 'A',
            link: function(scope, ele) {
                ele.bootstrapFileInput();
            }            
        }
    }

    // Dependency: https://github.com/rstaib/jquery-steps
    function uiWizardForm() {
        return {
            restrict: 'A',
            link: function(scope, ele) {
                ele.steps()
            }            
        }
    }

})(); 



;
(function () {
	'use strict';

	angular.module('app.ui.form.validation')
		.controller('formConstraintsCtrl', ['$scope', formConstraintsCtrl])
		.controller('signinCtrl', ['$scope', signinCtrl])
		.controller('signupCtrl', ['$scope', signupCtrl])
		
		/*
		.controller('signIn', ['$rootScope','$scope', '$state', '$http', 'logger', 'md5', signIn]);

	function signIn($rootScope, $scope, $state, $http, logger, md5) {			

		$scope.loginFunction = function(username, userpass){

			if(config.authType) {
			
			var info = {username: username, password: userpass};
					
			$http.post(config.url_service + '/login', info/*, {withCredentials: true}).then(function(datos) {

				$scope.main.name = datos.data.name;
				
				window.sessionStorage.setItem('token', datos.data.token);
				
				$state.go('apps');
			}, function(err) {
				return logger.logError(err.data.descripcion);
			});
		  } else {
			
			var info = {username: username, password: md5.createHash(userpass)};
					
			$http.post(config.url_service + '/login', info/*, {withCredentials: true}).then(function(datos) {
						
				$scope.main.name = datos.data.name;
						
				window.sessionStorage.setItem('token', datos.data.token);
						$state.go('state1');

			}, function(err) {
				return logger.logError(err.data.descripcion);
			});
		  }
		};
	}

	*/


	function formConstraintsCtrl($scope) {
		var original;

		$scope.form = {
			required: '',
			minlength: '',
			maxlength: '',
			length_rage: '',
			type_something: '',
			confirm_type: '',
			foo: '',
			email: '',
			url: '',
			num: '',
			minVal: '',
			maxVal: '',
			valRange: '',
			pattern: ''
		};

		original = angular.copy($scope.form);

		$scope.revert = function() {
			$scope.form = angular.copy(original);
			return $scope.form_constraints.$setPristine();
		};

		$scope.canRevert = function() {
			return !angular.equals($scope.form, original) || !$scope.form_constraints.$pristine;
		};

		$scope.canSubmit = function() {
			return $scope.form_constraints.$valid && !angular.equals($scope.form, original);
		};
	}

	function signinCtrl($scope) {
		var original;

		$scope.user = {
			email: '',
			password: ''
		};

		$scope.showInfoOnSubmit = false;

		original = angular.copy($scope.user);

		$scope.revert = function() {
			$scope.user = angular.copy(original);
			return $scope.form_signin.$setPristine();
		};

		$scope.canRevert = function() {
			return !angular.equals($scope.user, original) || !$scope.form_signin.$pristine;
		};

		$scope.canSubmit = function() {
			return $scope.form_signin.$valid && !angular.equals($scope.user, original);
		};

		$scope.submitForm = function() {
			$scope.showInfoOnSubmit = true;
			return $scope.revert();
		};
	}

	function signupCtrl($scope) {
		var original;

		$scope.user = {
			name: '',
			email: '',
			password: '',
			confirmPassword: '',
			age: ''
		};

		$scope.showInfoOnSubmit = false;

		original = angular.copy($scope.user);

		$scope.revert = function() {
			$scope.user = angular.copy(original);
			$scope.form_signup.$setPristine();
			return $scope.form_signup.confirmPassword.$setPristine();
		};

		$scope.canRevert = function() {
			return !angular.equals($scope.user, original) || !$scope.form_signup.$pristine;
		};

		$scope.canSubmit = function() {
			return $scope.form_signup.$valid && !angular.equals($scope.user, original);
		};

		$scope.submitForm = function() {
			$scope.showInfoOnSubmit = true;
			return $scope.revert();
		};

	}

})();

;
(function () {
    'use strict';

    angular.module('app.nav')
        .directive('toggleNavCollapsedMin', ['$rootScope', toggleNavCollapsedMin])
        .directive('collapseNav', collapseNav)
        .directive('highlightActive', highlightActive)
        .directive('toggleOffCanvas', toggleOffCanvas)
        .controller('menuCtrl', [ '$scope', '$state', '$stateParams', '$http', '$location', menuCtrl]);
    // swtich for mini style NAV, realted to 'collapseNav' directive

    function menuCtrl($scope, $state, $stateParams, $http, $location) {
           
            /*
           $http.get(config.url_service + '/getMenus').then(function(datos) {
                    $scope.menus = datos.data;
           });*/

    }

    function toggleNavCollapsedMin($rootScope) {

        var directive = {
            restrict: 'A',
            link: link
        };

        return directive;

        function link(scope, ele, attrs) {
            var app;

            app = $('#app');

            ele.on('click', function(e) {
                if (app.hasClass('nav-collapsed-min')) {
                    app.removeClass('nav-collapsed-min');
                } else {
                    app.addClass('nav-collapsed-min');
                    $rootScope.$broadcast('nav:reset');
                }
                return e.preventDefault();
            });
        }
        function linkHome(scope, ele, attrs) {

        }
    }

    // for accordion/collapse style NAV
    function collapseNav() {
        var directive = {
            restrict: 'A',
            link: link
        };

        return directive;

        function link(scope, ele, attrs) {
            var $a, $aRest, $app, $lists, $listsRest, $nav, $window, Timer, prevWidth, slideTime, updateClass;

            slideTime = 250;

            $window = $(window);

            $lists = ele.find('ul').parent('li');

            $lists.append('<i class="ti-angle-down icon-has-ul-h"></i><i class="ti-angle-right icon-has-ul"></i>');

            $a = $lists.children('a');

            $listsRest = ele.children('li').not($lists);

            $aRest = $listsRest.children('a');

            $app = $('#app');

            $nav = $('#nav-container');

            $a.on('click', function(event) {
                var $parent, $this;
                if ($app.hasClass('nav-collapsed-min') || ($nav.hasClass('nav-horizontal') && $window.width() >= 768)) {
                    return false;
                }
                $this = $(this);
                $parent = $this.parent('li');
                $lists.not($parent).removeClass('open').find('ul').slideUp(slideTime);
                $parent.toggleClass('open').find('ul').stop().slideToggle(slideTime);
                event.preventDefault();
            });

            $aRest.on('click', function(event) {
                $lists.removeClass('open').find('ul').slideUp(slideTime);
            });

            scope.$on('nav:reset', function(event) {
                $lists.removeClass('open').find('ul').slideUp(slideTime);
            });

            Timer = void 0;

            prevWidth = $window.width();

            updateClass = function() {
                var currentWidth;
                currentWidth = $window.width();
                if (currentWidth < 768) {
                    $app.removeClass('nav-collapsed-min');
                }
                if (prevWidth < 768 && currentWidth >= 768 && $nav.hasClass('nav-horizontal')) {
                    $lists.removeClass('open').find('ul').slideUp(slideTime);
                }
                prevWidth = currentWidth;
            };

            $window.resize(function() {
                var t;
                clearTimeout(t);
                t = setTimeout(updateClass, 300);
            });

        }
    }

    // Add 'active' class to li based on url, muli-level supported, jquery free
    function highlightActive() {
        var directive = {
            restrict: 'A',
            controller: [ '$scope', '$element', '$attrs', '$location', toggleNavCollapsedMinCtrl]
        };

        return directive;

        function toggleNavCollapsedMinCtrl($scope, $element, $attrs, $location) {
            var highlightActive, links, path;

            links = $element.find('a');

            path = function() {
                return $location.path();
            };

            highlightActive = function(links, path) {
                path = '#' + path;
                return angular.forEach(links, function(link) {
                    var $li, $link, href;
                    $link = angular.element(link);
                    $li = $link.parent('li');
                    href = $link.attr('href');
                    if ($li.hasClass('active')) {
                        $li.removeClass('active');
                    }
                    if (path.indexOf(href) === 0) {
                        return $li.addClass('active');
                    }
                });
            };

            highlightActive(links, $location.path());

            $scope.$watch(path, function(newVal, oldVal) {
                if (newVal === oldVal) {
                    return;
                }
                return highlightActive(links, $location.path());
            });

        }

    }

    // toggle on-canvas for small screen, with CSS
    function toggleOffCanvas() {
        var directive = {
            restrict: 'A',
            link: link
        };

        return directive;

        function link(scope, ele, attrs) {
            ele.on('click', function() {
                return $('#app').toggleClass('on-canvas');
            });
        }
    }


})();

;
(function () {
    'use strict';

    angular.module('app.page')
        .controller('invoiceCtrl', ['$scope', '$window', invoiceCtrl])
        .controller('authCtrl', ['$scope', '$window', '$location', authCtrl]);

    function invoiceCtrl($scope, $window) {
        var printContents, originalContents, popupWin;
        
        $scope.printInvoice = function() {
            printContents = document.getElementById('invoice').innerHTML;
            originalContents = document.body.innerHTML;        
            popupWin = window.open();
            popupWin.document.open();
            popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="styles/main.css" /></head><body onload="window.print()">' + printContents + '</html>');
            popupWin.document.close();
        }
    }

    function authCtrl($scope, $window, $location) {
            $scope.login = function() {
                $location.url('/')
            }

            $scope.signup = function() {
                $location.url('/')
            }

            $scope.reset =  function() {
                $location.url('/')
            }

            $scope.unlock =  function() {
                $location.url('/')
            }   
    }

})(); 




;
(function () {
    'use strict';

    angular.module('app.page')
        .directive('customPage', customPage);


    // add class for specific pages to achieve fullscreen, custom background etc.
    function customPage() {
        var directive = {
            restrict: 'A',
            controller: ['$scope', '$element', '$location', customPageCtrl]
        };

        return directive;

        function customPageCtrl($scope, $element, $location) {
            var addBg, path;

            path = function() {
                return $location.path();
            };

            addBg = function(path) {
                $element.removeClass('body-wide body-err body-lock body-auth');
                switch (path) {
                    case '/404':
                    case '/page/404':
                    case '/page/500':
                        return $element.addClass('body-wide body-err');
                    case '/page/signin':
                    case '/page/signup':
                    case '/page/forgot-password':
                        return $element.addClass('body-wide body-auth');
                    case '/page/lock-screen':
                        return $element.addClass('body-wide body-lock');
                }
            };

            addBg($location.path());

            $scope.$watch(path, function(newVal, oldVal) {
                if (newVal === oldVal) {
                    return;
                }
                return addBg($location.path());
            });
        }        
    }
 
})(); 



;
(function () {
    'use strict';

    angular.module('app.table')
        .controller('tableCtrl', ['$scope', '$filter', '$http', tableCtrl]);

    function tableCtrl($scope, $filter, $http) {
       
        
        var init;

        $scope.stores = [];

        $scope.searchKeywords = '';

        $scope.filteredStores = [];

        $scope.row = '';

        $scope.select = function(page) {
            var end, start;
            start = (page - 1) * $scope.numPerPage;
            end = start + $scope.numPerPage;
            return $scope.currentPageStores = $scope.filteredStores.slice(start, end);
        };

        $scope.onFilterChange = function() {
            $scope.select(1);
            $scope.currentPage = 1;
            return $scope.row = '';
        };

        $scope.onNumPerPageChange = function() {
            $scope.select(1);
            return $scope.currentPage = 1;
        };

        $scope.onOrderChange = function() {
            $scope.select(1);
            return $scope.currentPage = 1;
        };

        $scope.search = function() {
            $scope.filteredStores = $filter('filter')($scope.stores, $scope.searchKeywords);
            return $scope.onFilterChange();
        };

        $scope.order = function(rowName) {
            if ($scope.row === rowName) {
                return;
            }
            $scope.row = rowName;
            $scope.filteredStores = $filter('orderBy')($scope.stores, rowName);
            return $scope.onOrderChange();
        };

        $scope.numPerPageOpt = [3, 5, 10, 20];

        $scope.numPerPage = $scope.numPerPageOpt[2];

        $scope.currentPage = 1;

        $scope.currentPageStores = [];

        init = function() {
             $http.get(config.url_service + '/search_test').then(function(datos) {
                console.log(datos.data);
                datos.data.forEach(function(currentValue) {
                    $scope.stores.push(currentValue);
                });

            });
            $scope.search();
            return $scope.select($scope.currentPage);
        };

        init();
    }

})(); 
;
(function () {
    'use strict';

    angular.module('app.ui')
        /*.config(function($stateProvider, $urlRouterProvider) {
            $stateProvider
              .state('login', {
                url: "page/signin",
                templateUrl: "app/page/signin.html"
              })
        })*/
        .controller('LoaderCtrl', ['$scope', 'cfpLoadingBar', LoaderCtrl])
        .controller('NotifyCtrl', ['$scope', 'logger', NotifyCtrl])
        .controller('AlertDemoCtrl', ['$scope', AlertDemoCtrl])
        .controller('ProgressDemoCtrl', ['$scope', ProgressDemoCtrl])
        .controller('AccordionDemoCtrl', ['$scope', AccordionDemoCtrl])
        .controller('CollapseDemoCtrl', ['$scope', CollapseDemoCtrl])
        .controller('ModalDemoCtrl', ['$scope', '$uibModal', '$log', ModalDemoCtrl])
        .controller('ModalInstanceCtrl', ['$scope', '$uibModalInstance', 'items', ModalInstanceCtrl])
        .controller('PaginationDemoCtrl', ['$scope', PaginationDemoCtrl])
        .controller('TabsDemoCtrl', ['$scope', TabsDemoCtrl])
        .controller('MapDemoCtrl', ['$scope', '$http', '$interval', MapDemoCtrl]);


    function LoaderCtrl($scope, cfpLoadingBar) {
        /*
        $scope.start = function() {
            cfpLoadingBar.start();
        }

        // increments the loading bar by a random amount.
        $scope.inc = function() {
            cfpLoadingBar.inc();
        }

        $scope.set = function() {
            cfpLoadingBar.set(0.3);
        }

        $scope.complete = function() {
            cfpLoadingBar.complete()
        }*/
        console.log("hola mundo")
    }

    function NotifyCtrl($scope, logger) {
        $scope.notify = function(type) {
            switch (type) {
                case 'info':
                    return logger.log("Heads up! This alert needs your attention, but it's not super important.");
                case 'success':
                    return logger.logSuccess("Success!");
                case 'warning':
                    return logger.logWarning("Warning! Best check yo self, you're not looking too good.");
                case 'error':
                    return logger.logError("Oh snap! Change a few things up and try submitting again.");
            }
        };
    }

    function AlertDemoCtrl($scope) {
        $scope.alerts = [
            {
                type: 'success',
                msg: 'Well done! You successfully read this important alert message.'
            }, {
                type: 'info',
                msg: 'Heads up! This alert needs your attention, but it is not super important.'
            }, {
                type: 'warning',
                msg: "Warning! Best check yo self, you're not looking too good."
            }, {
                type: 'danger',
                msg: 'Oh snap! Change a few things up and try submitting again.'
            }
        ];

        $scope.addAlert = function() {
            var num, type;
            num = Math.ceil(Math.random() * 4);
            type = void 0;
            switch (num) {
                case 0:
                    type = 'info';
                    break;
                case 1:
                    type = 'success';
                    break;
                case 2:
                    type = 'info';
                    break;
                case 3:
                    type = 'warning';
                    break;
                case 4:
                    type = 'danger';
            }
            return $scope.alerts.push({
                type: type,
                msg: "Another alert!"
            });
        };

        $scope.closeAlert = function(index) {
            return $scope.alerts.splice(index, 1);
        };
    }

    function ProgressDemoCtrl($scope) {
        $scope.max = 200;

        $scope.random = function() {
            var type, value;
            value = Math.floor((Math.random() * 100) + 10);
            type = void 0;
            if (value < 25) {
                type = "success";
            } else if (value < 50) {
                type = "info";
            } else if (value < 75) {
                type = "warning";
            } else {
                type = "danger";
            }
            $scope.showWarning = type === "danger" || type === "warning";
            $scope.dynamic = value;
            $scope.type = type;
        };

        $scope.random();

    }

    function AccordionDemoCtrl($scope) {
        $scope.oneAtATime = true;

        $scope.groups = [
            {
                title: "Dynamic Group Header - 1",
                content: "Dynamic Group Body - 1"
            }, {
                title: "Dynamic Group Header - 2",
                content: "Dynamic Group Body - 2"
            }, {
                title: "Dynamic Group Header - 3",
                content: "Dynamic Group Body - 3"
            }
        ];

        $scope.items = ["Item 1", "Item 2", "Item 3"];

        $scope.status = {
            isFirstOpen: true,
            isFirstOpen1: true
        };

        $scope.addItem = function() {
            var newItemNo;
            newItemNo = $scope.items.length + 1;
            $scope.items.push("Item " + newItemNo);
        };
    }

    function CollapseDemoCtrl($scope) {
        $scope.isCollapsed = false;
    }

    function ModalDemoCtrl($scope, $uibModal, $log) {
        $scope.items = ['item1', 'item2', 'item3'];

        $scope.animationsEnabled = true;

        $scope.open = function (size) {

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'myModalContent.html',
                controller: 'ModalInstanceCtrl',
                size: size,
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.toggleAnimation = function () {
            $scope.animationsEnabled = !$scope.animationsEnabled;
        };
    }

    function ModalInstanceCtrl($scope, $uibModalInstance, items) {
        $scope.items = items;

        $scope.selected = {
            item: $scope.items[0]
        };

        $scope.ok = function() {
            $uibModalInstance.close($scope.selected.item);
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss("cancel");
        };

    }

    function PaginationDemoCtrl($scope) {
        $scope.totalItems = 64;

        $scope.currentPage = 4;

        $scope.setPage = function(pageNo) {
            $scope.currentPage = pageNo;
        };

        $scope.maxSize = 5;

        $scope.bigTotalItems = 175;

        $scope.bigCurrentPage = 1;
    }

    function TabsDemoCtrl($scope) {
        $scope.tabs = [
            {
                title: "Dynamic Title 1",
                content: "Dynamic content 1.  Consectetur adipisicing elit. Nihil, quidem, officiis, et ex laudantium sed cupiditate voluptatum libero nobis sit illum voluptates beatae ab. Ad, repellendus non sequi et at."
            }, {
                title: "Disabled",
                content: "Dynamic content 2.  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nihil, quidem, officiis, et ex laudantium sed cupiditate voluptatum libero nobis sit illum voluptates beatae ab. Ad, repellendus non sequi et at.",
                disabled: true
            }
        ];

        $scope.navType = "pills";
    }


    function MapDemoCtrl($scope, $http, $interval) {
        var i, markers;

        markers = [];

        i = 0;

        while (i < 8) {
            markers[i] = new google.maps.Marker({
                title: "Marker: " + i
            });
            i++;
        }

        $scope.GenerateMapMarkers = function() {
            var d, lat, lng, loc, numMarkers;
            d = new Date();
            $scope.date = d.toLocaleString();
            numMarkers = Math.floor(Math.random() * 4) + 4;
            i = 0;
            while (i < numMarkers) {
                lat = 43.6600000 + (Math.random() / 100);
                lng = -79.4103000 + (Math.random() / 100);
                loc = new google.maps.LatLng(lat, lng);
                markers[i].setPosition(loc);
                markers[i].setMap($scope.map);
                i++;
            }
        };

        $interval($scope.GenerateMapMarkers, 2000);

    }

})();

;
(function () {
    'use strict';

    angular.module('app.ui')
        .directive('uiTime', uiTime)
        .directive('uiNotCloseOnClick', uiNotCloseOnClick)
        .directive('slimScroll', slimScroll)
        .directive('imgHolder', imgHolder);

    function uiTime() {
        var directive = {
            restrict: 'A',
            link: link
        };

        return directive;

        function link(scope, ele) {
            var checkTime, startTime;

            startTime = function() {
                var h, m, s, t, time, today;
                today = new Date();
                h = today.getHours();
                m = today.getMinutes();
                s = today.getSeconds();
                m = checkTime(m);
                s = checkTime(s);
                time = h + ":" + m + ":" + s;
                ele.html(time);
                return t = setTimeout(startTime, 500);
            };

            checkTime = function(i) {
                if (i < 10) {
                    i = "0" + i;
                }
                return i;
            };

            startTime();
        }  
    }

    function uiNotCloseOnClick() {
        return {
            restrict: 'A',
            compile: function(ele, attrs) {
                return ele.on('click', function(event) {
                    return event.stopPropagation();
                });
            }
        };
    }

    function slimScroll() {
        return {
            restrict: 'A',
            link: function(scope, ele, attrs) {
                return ele.slimScroll({
                    height: attrs.scrollHeight || '100%'
                });
            }
        };
    }

    function imgHolder() {
        return {
            restrict: 'A',
            link: function(scope, ele, attrs) {
                return Holder.run({
                    images: ele[0]
                });
            }
        };
    }

})(); 
;
(function () {
    'use strict';

    angular.module('app.ui')
        .factory('logger', logger)

    function logger() {

        var logIt;

        // toastr setting.
        toastr.options = {
            "closeButton": true,
            "positionClass": "toast-bottom-right",
            "timeOut": "3000"
        };

        logIt = function(message, type) {
            return toastr[type](message);
        };

        return {
            log: function(message) {
                logIt(message, 'info');
            },
            logWarning: function(message) {
                logIt(message, 'warning');
            },
            logSuccess: function(message) {
                logIt(message, 'success');
            },
            logError: function(message) {
                logIt(message, 'error');
            }
        };

    }

})(); 
;
  // Config

var config = {
  "url_service": 'http://172.16.8.54:3001',
  "authType" : true,
  "appName": "Cardinal"
}


;
(function () {
    'use strict';

    angular.module('app')
        .controller('callcenterCtrl', [ '$scope', '$state', '$stateParams', '$http', '$uibModal', '$log', '$location', callcenterCtrl])
        .controller('cambioEstadoContactoCtrl', [ '$scope', '$state', '$stateParams', '$http', '$uibModalInstance', 'contacto', 'logger', cambioEstadoContactoCtrl]);

    function callcenterCtrl($scope, $state, $stateParams, $http, $uibModal, $log, $location) {

          var app;
          app = $('#app');

          if (app.hasClass('nav-collapsed-min')) {
                app.removeClass('nav-collapsed-min');
          };

          var nav;
          nav = $('#nav');

          if (nav.hasClass('hidden')) {
                nav.removeClass('hidden');
          };

          $scope.contact = {
            nombre: "",
            apellido: "",
            edad: ""
          };

          function getStatesForOp() {
            return new Promise(
              (resolve, reject) => {
                $http({
                  method: 'GET',
                  url: config.url_service + '/getData',
                  params: { collection: 'operadores_callcenter'}
                })
                .then(
                  (result) => {
                    //resolve(result.data[0]);
                    return result.data[0].CAMPANA;
                })
                .then(
                  (result) => {
                    
                    $http({
                      method: 'GET',
                      url: config.url_service + '/getData',
                      params: { collection: 'estados_por_campana', campana: result}
                    })
                    .then(
                      (result) => {
                        //resolve(result);
                        $scope.contact_states = result.data[0].ESTADOS;
                    })
                })
              })
          }

          getStatesForOp()
            .then(
              (result) => {
                console.log(result);
            })

          $scope.actualizarEstado = function() {

            $scope.state_contact = {
              contacto: $scope.contact,
              campana: $scope.campana_id
            }

            var modalInstance = $uibModal.open({
              animation: $scope.animationsEnabled,
              templateUrl: 'app/callcenter/modalCambioEstadoContacto.html',
              controller: 'cambioEstadoContactoCtrl',
              scope: $scope,
              size: 'lg',
              resolve: {
                contacto: function () {
                  return $scope.model_object;
                }
              }
            });


            modalInstance.result.then(function (selectedItem) {
              $scope.selected = selectedItem;
            }, function () {
              $log.info('Modal dismissed at: ' + new Date());
            });

          };

          function nextContact(id) {
            return new Promise(
              (resolve, reject) => {
                $http({
                  method: 'GET',
                  url: config.url_service + '/getContactsById',
                  params: { collection: 'test_contacts', id: id}
                })
                .then(
                  (result) => {
                    console.log(result.data);
                    resolve(result.data)
                  })
              })
          }

          $scope.model_id = null;

          $scope.siguienteContacto = function() {
            //console.log("hola mundo");

            nextContact($scope.model_id)
              .then(
                (result) => {
                    console.log(result);
                    $scope.model_object = result;

                    $scope.model_id = result._id;

                    $scope.contact = {
                      nombre: result.NOMBRE,
                      apellido: result.APELLIDO,
                      edad: result.EDAD,
                      dni: result.DNI,
                      direccion: result.DIRECCION,
                      telefono: result.TELEFONO
                    };
                    $scope.success_this = result.ESTADO;
                })
              .catch(
                (err) => {
                  console.log(err);
                })
          }
      }

      function cambioEstadoContactoCtrl ($scope, $state, $stateParams, $http, $uibModalInstance, contacto, logger) {
        
        console.log(contacto)
        
        $http({
            method: "GET",
            url: config.url_service + "/getContactsByCampana",
            params: { collection: "estados_por_campana" }
        })
        .then((result) => {
          //console.log(result)
          $scope.estado_contacto = result.data.ESTADOS[contacto.ESTADO];
          return result;
        })
        

        $scope.cancelarCambio = function() {
          $uibModalInstance.dismiss("cancel");
        };

        $scope.guardarEstado = function() {


          if($scope.nuevo_estado_contacto == contacto.ESTADO || $scope.nuevo_estado_contacto > contacto.ESTADO) {
            
            if($scope.motivo_contacto !== undefined) {
              
              var contact_data = {
                  collection: 'test_contacts', 
                  campana: contacto.campana, 
                  contacto_id: contacto._id,
                  motivo: $scope.motivo_contacto,
                  new_state: $scope.nuevo_estado_contacto
              };
                  $http({
                    method: 'POST',
                    url: config.url_service + '/changeContactState',
                    data: contact_data
                  })
                  .then((result) => {
                    $uibModalInstance.dismiss("close");
                  });

            } else {
              logger.logError('Debe agregar un motivo para realizar el cambio de Estado.');
            }
          } else {
              logger.logError('Estado seleccionado es invalido.');
          }

        };
      }


})();
;
(function () {
  'use strict'; 

  angular.module('app')
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('main-ventas', {
      url: "ventas/ventas",
      templateUrl: "app/ventas/ventas.html"
    })
    .state('nueva_asignacion_campana', {
      url: "crm/asignacion/asignacion",
      templateUrl: "app/crm/asignacion/asignacion.html"
    })
    .state('campanas_asignadas', {
      url: "ventas/campanas-asignadas",
      templateUrl: "app/ventas/campanas-asignadas.html"
    })
    .state('detalle_campanas_asignadas', {
      url: "ventas/detalle-campanas-asignadas",
      templateUrl: "app/ventas/detalle-campanas-asignadas.html",
      params: { id: null }
    })
    .state('tabla_contratos', {
      url: "ventas/tabla-contratos",
      templateUrl: "app/ventas/tabla-contratos.html",
      params: { id: null }
    })
    .state('nuevo_contrato', {
      url: "ventas/carga-contratos",
      templateUrl: "app/ventas/carga-contratos.html",
      params: { id: null }
    })
    .state('tabla_campanas', {
      url: "ventas/tabla-campanas",
      templateUrl: "app/ventas/tabla-campanas.html",
      params: { id: null }
    })
    .state('nueva_campana', {
      url: "ventas/carga-campanas",
      templateUrl: "app/ventas/carga-campanas.html",
      params: { id: null }
    })
    .state('importador-campanas', {
      url: "import/importador-campanas",
      templateUrl: "app/import/importador-campanas.html",
      params: { id: null }
    })
    .state('main-aplicaciones', {
      url: 'main/aplicaciones',
      templateUrl: "app/main/aplicaciones.html"
    })
    .state('tabla-comerciales', {
      url: 'ventas/tabla-comerciales',
      templateUrl: "app/ventas/tabla-comerciales.html",
    })
    .state('carga-comerciales', {
      url: 'ventas/carga-comerciales',
      templateUrl: "app/ventas/carga-comerciales.html"
    })
    .state('comerciales-cardinal', {
      views: {
        "responsables-cardinal": {
          templateUrl: "app/ventas/carga-comerciales-cardinal.html",
          controller: 'tablaComercialesCardinalCtrl'
        }
      }
    })
    .state('comerciales-clientes', {
      views: {
        "responsables-clientes": {
          templateUrl: "app/ventas/carga-comerciales-clientes.html",
          controller: 'tablaComercialesClientesCtrl'
        }
      }
    })
    .state('pantalla-operador', {
      url: 'callcenter/pantalla-operador',
      templateUrl: "app/callcenter/pantalla-operador.html"
    })
  })
  .controller('ventasCtrl', [ '$scope', '$state', '$stateParams', '$http', ventasCtrl])
  .controller('asignacionCampCtrl', [ '$scope', '$state', '$stateParams', '$http', 'logger', asignacionCampCtrl])
  .controller('campanasAsignadasCtrl', ['$scope', '$state', '$stateParams', '$http', '$uibModal', '$log', 'logger', 'NgTableParams', campanasAsignadasCtrl])
  .controller('detalleCampAsignadasCtrl', ['$scope', '$state', '$stateParams', '$http', '$uibModalInstance', '$log', 'logger','NgTableParams', 'asignacion', detalleCampAsignadasCtrl])
  .controller('tablaContratosCtrl', ['$scope', '$state', '$stateParams', '$http', 'NgTableParams', tablaContratosCtrl])
  .controller('cargaContratosCtrl', ['$scope', '$state', '$stateParams', '$http', 'NgTableParams', 'logger', cargaContratosCtrl])
  .controller('tablaCampanasCtrl', ['$scope', '$state', '$stateParams', '$http', '$uibModal', '$log', 'NgTableParams', 'logger', tablaCampanasCtrl])
  .controller('verDetallesCampanaCtrl', ['$scope', '$state', '$stateParams', '$http', '$uibModalInstance', 'NgTableParams', 'logger', 'campana', verDetallesCampanaCtrl])
  .controller('cargaCampanasCtrl', ['$scope', '$state', '$stateParams', '$http', 'NgTableParams', 'logger', cargaCampanasCtrl])
  .controller('responsablesComercialesCtrl', ['$scope', '$state', '$stateParams', '$http', '$uibModal', '$log', '$route', '$routeParams', '$location', 'NgTableParams', 'logger', responsablesComercialesCtrl])
  .controller('tablaComercialesCardinalCtrl', ['$scope', '$state', '$stateParams', '$http', '$uibModal', '$log', 'NgTableParams', 'logger', tablaComercialesCardinalCtrl])
  .controller('cargaComercialesCardinalCtrl', ['$scope', '$state', '$stateParams', '$http', '$uibModalInstance', 'items', 'NgTableParams', 'logger', cargaComercialesCardinalCtrl])
  .controller('tablaComercialesClientesCtrl', ['$scope', '$state', '$stateParams', '$http', '$uibModal', '$log', 'NgTableParams', 'logger', tablaComercialesClientesCtrl])
  .controller('cargaComercialesClientesCtrl', ['$scope', '$state', '$stateParams', '$http', '$uibModalInstance', 'items', 'NgTableParams', 'logger', cargaComercialesClientesCtrl])

  .controller('uploadContratoCtrl', ['$scope', '$state', '$stateParams', '$http', 'NgTableParams', 'logger', 'FileUploader', uploadContratoCtrl]);
  

  function ventasCtrl($scope, $state, $stateParams, $http) {

    var app;
    app = $('#app');

    if (app.hasClass('nav-collapsed-min')) {
      app.removeClass('nav-collapsed-min');
    };

    var nav;
    nav = $('#nav');

    if (nav.hasClass('hidden')) {
      nav.removeClass('hidden');
    };

    var token = window.sessionStorage.getItem("token");
    /*
        $http.get(config.url_service + '/getMenus').then(function(datos) {

                    //console.log(datos.data);
                    
                    $scope.datas = datos.data[0].submenus;
                    /*
                    datos.data.forEach(function(currentValue) {

                    if(appName === currentValue.name) {
                            //console.log(currentValue);
                            $scope.datas = currentValue;
                        }          
                      });
                    }); */

                    $http({
                      method: 'GET',
                      url: config.url_service + '/getMenus',
                      params: {menu: "Ventas"}
                    })
                    .then(function(result) {
            //console.log(result.data);
            $scope.datas = result.data[0].submenus;
          })
                    .catch(function(err) {
                      console.log(err);
                    })

                    $scope.volverMain = function() {
                      $state.go('main-aplicaciones');
                    }

                  }

                  function asignacionCampCtrl($scope, $state, $stateParams, $http, logger) {



                    /* Configuracion del Panel Usuarios/Grupos*/
                    $scope.oneAtATime = true;

                    $scope.usersName = {};

                    var getCallcenterVentas = {
                      collection: 'grupos'
                    };

                    $http({
                      method: 'GET',
                      url: config.url_service + '/getData/',
                      params: getCallcenterVentas
                    })
                    .then(function (data, status) {
                      $scope.grupos = data.data;
                    }).catch(function(err) {
                      console.log(err);
                    });

                    $scope.form = {
                      cliente: "",
                      campana: "",
                      puntodecontacto: "",
                      fechainicio: "",
                      fechafin: "",
                      comercial: "",
                      archivo: "",
                      estado: "Todos"
                    };                

                    var getClientesCampanas = {
                      collection: 'clientes_sinc_t'
                    }

                    $http({
                      method: 'GET',
                      url: config.url_service + '/getData/',
                      params: getClientesCampanas
                    })
                    .then(function (result, status) {
                //console.log(data.data);
                  //console.log(result.data)
                  $scope.clientes_array = result.data;
                }).catch(function(err) {
                  console.log(err);
                });

                $scope.clienteSelecionado = {};  

                $scope.onSelectCliente = function(item){
          //console.log(item.campanas);
          $scope.campanas_array = item.campanas;
        };

        $scope.onSelectCampana = function(item){
            //console.log(item);
            $scope.form = {
              cliente: item.cliente_nombre,
              campana: item.nombre_campana,
              puntodecontacto: item.punto_contacto,
              fechainicio: item.fecha_inicio,
              fechafin: item.fecha_fin,
              comercial: item.resp_com,
              archivo: item.nom_arch,
              estado: item.estados
            };

          };
          $scope.groupSelected = false;    

          $scope.updateOpenStatus = function(index){
            console.log(index);
            $scope.isOpen = $scope.grupos.some(function(item){
              console.log(item.isOpen);

              if(item.isOpen && index) {
                $scope.abierto = "+";
              } 

              if(!item.isOpen) {
                $scope.abierto = "-";
              }

              return item.isOpen;  
            });
          }




          $scope.selectCurrentGroup = function($event, grupo){
            if($event) {
        //console.log("hola mundo");
        $scope.groupSelected = true;
        $event.preventDefault();
        $event.stopPropagation();
        /* - - - - - - - */
        //console.log(grupo)
        //console.log($scope.grupos);
        $scope.grupos.forEach(function(currGroup) {
          if(currGroup.grupo == grupo){
              //console.log(currGroup.usuarios);
              currGroup.usuarios.forEach(function(currUser) {
                $scope.usersName[currUser.name] = !$scope.usersName[currUser.name];
              });
            }
          });
      }
    }

    $scope.clicked = function(event) {
      console.log(event);
    };

    $scope.limpiarCampos = function(){

      $scope.form = {
        cliente: "",
        campana: "",
        puntodecontacto: "",
        fechainicio: "",
        fechafin: "",
        comercial: "",
        archivo: "",
        estado: "Todos"
      };

    };

    $scope.cancelarModulo = function(){
        //console.log("esta abandonando el modulo");
        var conf = confirm('¿Desea abandonar la aplicación?');
        if(conf){
          $state.go('campanas_asignadas');
        }
      };

      $scope.asignarCampana = function(){

        /*
         
         * Formato de registro *
          ---------------------
          cliente
          campana
          puntodecontacto
          fechainicio
          fechafin
          comercial
          archivo
          estado

          */

          if($scope.form.cliente == "") {
            logger.logError("No se ha agregado el Campo Cliente");
          }

          if($scope.form.campana == "") {
            logger.logError("No se ha agregado el Campo Campaña");
          }

          if($scope.form.puntodecontacto == "") {
            logger.logError("No se ha agregado el Campo Punto de Contacto");
          }

          if($scope.form.fechainicio == "") {
            logger.logError("No se ha agregado el Campo Fecha de Inicio");
          }

          if($scope.form.fechafin == "") {
            logger.logError("No se ha agregado el Campo Fecha de Fin");
          }

          if($scope.form.comercial == "") {
            logger.logError("No se ha agregado el Campo Responsable Comercial");
          }

          if($scope.form.archivo == "") {
            logger.logError("No se ha agregado el Campo Nombre de Archivo");
          }

        /*
        if($scope.form.estado == "") {
            logger.logError("No se ha agregado el nombre de Cliente");
        }        
        */

        else {

          $scope.operadoresSelecionados = [];

          angular.forEach($scope.usersName, function(currVal, currKey) {
            if(currVal){
              $scope.operadoresSelecionados.push(currKey);
            };
          });

          if($scope.operadoresSelecionados.length == 0) {
            logger.logError("No se han agregado Operadores a la Asignación correspondiente");
          } 

          else {

            var objRegistro = {
              "CLIENTE": $scope.form.cliente,
              "CAMPANA": $scope.form.campana,
              "PUNTO_DE_CONTACTO": $scope.form.puntodecontacto,
              "FECHA_INICIO_OPE": $scope.form.fechainicio,
              "FECHA_FIN_OPE": $scope.form.fechafin,
              "RESPONSABLE_COMERCIAL": $scope.form.comercial,
              "ARCHIVO_SELECCIONADO": $scope.form.archivo,
              "ESTADO": $scope.form.estado,
              "OPERADORES": $scope.operadoresSelecionados
            };

            var conf = confirm("¿Desea guardar la asignación correspondiente?");

            if (conf) {
              console.log(objRegistro);

              $http({
                method: 'POST',
                url: config.url_service + "/setData/",
                data: { collection: 'campanas_asignadas', registro: objRegistro }
              })
              .then(function (data, status) {
                      //console.log(data);
                      $state.go('campanas_asignadas');
                    });

            }
          }

        }

      };
    }


    function campanasAsignadasCtrl($scope, $state, $stateParams, $http, $uibModal, $log, logger, NgTableParams) {
      //console.log("hola mundo");

      var getCampanasAsingadas = {
        collection: 'campanas_asignadas'
      }

      $http({
        method: 'GET',
        url: config.url_service + '/getData/',
        params: getCampanasAsingadas
      })
      .then(function (data, status) {
        console.log(data.data);
        $scope.campanas_asignadas_array = data.data;

        $scope.tableParams = new NgTableParams({
          page: 1,
          count: 10,
          sorting: { CLIENTE: 'asc' }
        }, {
                //total: $scope.campanas_asignadas_array.length,
                dataset: data.data//$scope.campanas_asignadas_array
              });

      }).catch(function(err) {
        console.log(err);
      });

      $scope.nuevaAsigCamp = function() {
        $state.go('nueva_asignacion_campana');
      }

      
 
          $scope.volverMain = function() {
            $state.go('main-ventas');
          }
        
      $scope.verDetalle = function(id) {

        console.log(id);

        $scope.view_asignacion = id;
        
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'app/crm/asignacion/modalVerDetallesAsignacion.html',
            controller: 'detalleCampAsignadasCtrl',
            size: 'lg',
            resolve: {
              asignacion: function () {
                return $scope.view_asignacion;
              }
            }
          });

          modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
          }, function () {
            $log.info('Modal dismissed at: ' + new Date());
          });
      };

  }


  function detalleCampAsignadasCtrl ($scope, $state, $stateParams, $http, $uibModalInstance, $log, logger, NgTableParams, asignacion){
    
    console.log(asignacion);

    $scope.form = {
      nombre_campana: "",
      cliente_campana: ""
    }; 

    $http({
      method: 'GET',
      url: config.url_service + '/getData',
      params: { collection: 'campanas_asignadas', id: asignacion }
    })
    .then((result) => {
      console.log(result.data[0]);
      $scope.form.nombre_campana = result.data[0].CAMPANA;
      $scope.form.cliente_campana = result.data[0].CLIENTE;
      $scope.estados_asignados = result.data[0].ESTADOS;
    });

    $scope.volverTabla = function() {
      $uibModalInstance.dismiss("cancel");
    };
        
  }

  function tablaContratosCtrl($scope, $state, $stateParams, $http, NgTableParams) {
      //console.log("hola mundo");
      $scope.nuevoContrato = function() {
        $state.go('nuevo_contrato');
      };

      $http({
        method: 'GET',
        url: config.url_service + '/getData',
        params: { collection: 'contratos' }
      })
      .then(function(result) {
        console.log(result.data);
        $scope.contratos = result.data;

        $scope.tableContratos = new NgTableParams({
          page: 1,
          count: 10,
          sorting: { name: 'asc' }
        }, {
                //total: data.data,
                dataset: result.data
              });
      })
      .catch(function(err) {
        console.log(err.data); 
      });

      $scope.verContrato = function(contrato) {
        console.log(contrato);
      //window.open("data:application/pdf," + contrato);
      window.open('data:application/pdf;base64,' + contrato);
    };

    $scope.volverMain = function(){
      $state.go('main-ventas');
    }
  }

  function cargaContratosCtrl($scope, $state, $stateParams, $http, NgTableParams, logger) {


    $scope.onLoad = function (e, reader, file, fileList, fileOjects, fileObj) {
      logger.logSuccess('El archivo a sido cargado');
      $scope.form.contrato_doc = fileObj.base64;
    };

    $scope.seeFile = function() {
      console.log($scope.form.files);
    }

    $scope.form = {
      telefono: "",
      fecha_inicio: "",
      fecha_fin: "",
      estado: "",
      area_servicio: "",
      ano_mes: "",
      codigo_contrato: "",
      contrato_doc: ""
    };

      // Trae a todos los clientes disponibles en la tabla Clientes
      var getClientesCampanas = {
        collection: 'clientes_sinc_t'
      };

      $http({
        method: 'GET',
        url: config.url_service + '/getData/',
        params: getClientesCampanas
      })
      .then(function (data, status) {
                //console.log(data.data);
                $scope.clientes_array = data.data;
              }).catch(function(err) {
                console.log(err);
              }); 

      // Al selecionar un Cliente se colocaran los datos en la Vista por medio de esta funcion
      $scope.onSelectCliente = function(item) {

        $scope.cliente_id = item._id;
        $scope.cliente_nombre = item.NOM_COM;
        $scope.direccionComercial = item.DIR_COM;
        //$scope.telefonoComercial = item.telefono;
      };


      // Trae a todos los Responsables Comerciales disponibles en la tabla cardinal_comerciales    
      var getClientesCampanas = {
        collection: 'cardinal_comerciales'
      }

      $http({
        method: 'GET',
        url: config.url_service + '/getData/',
        params: getClientesCampanas
      })
      .then(function (data, status) {
                //console.log(data.data);
                //console.log($scope.id_cliente);
                $scope.comerciales_array = data.data;
              }).catch(function(err) {
                console.log(err);
              });

      //Al selecionar un Responsable Comercial, esta funcion colocará los datos en la Vista
      $scope.onSelectComerc = function(item) {
        //console.log(item);
        $scope.objRespCom = item._id;
        $scope.respComercEmail = item.email;
        $scope.respComercRol = item.rol;
        $scope.respComercNumTel = item.numero_tel;
        $scope.respComercNumCel = item.numero_cel;
      };


      // Cancela el Contrato Actual y envia al operador a la vista Campañas y Contratos
      $scope.volverContrCamps = function() {
        $state.go('tabla_contratos');
      };

      // Guarda el Contrato actual y envia al operador a la vista Campañas y Contratos
      $scope.guardarContrato = function() {

        //console.log($scope.clienteName);

        $scope.objCliente = {
          id: $scope.cliente_id,
          nombre :$scope.cliente_nombre,
          direccion: $scope.direccionComercial
        };

        var datos_contrato = {
          contrato_status: $scope.form.estado,
          contrato_scaneado: $scope.form.contrato_doc,
          contrato_area_servicio: $scope.form.area_servicio,
          contrato_ano_mes: $scope.form.ano_mes,
          contrato_codigo_contrato: $scope.form.codigo_contrato
        };   

        var objRegistro = {
          CLIENTE: $scope.cliente_nombre,
          cliente_data: $scope.objCliente,
          responsable_comercial: $scope.objRespCom,
          datos_contrato: datos_contrato
        };

        console.log(objRegistro); 

        $http({
          method: 'POST',
          url: config.url_service + "/setData",
          data: { collection: 'contratos', registro: objRegistro }
        })
        .then(function (data, status) {
            //console.log(data.data.upserted[0]._id);
            $state.go('tabla_contratos');                
          });
      };


    }

    function tablaCampanasCtrl($scope, $state, $stateParams, $http, $uibModal, $log, NgTableParams, logger) {

      $http({
        method: 'GET',
        url: config.url_service + '/getData',
        params: { collection: "campanas" }
      })
      .then(function(result) {
    //console.log(result);

    $scope.tableCampanas = new NgTableParams({
      page: 1,
      count: 10,
      sorting: { name: 'asc' }
    }, {
                //total: data.data,
                dataset: result.data
              });
  })
      .catch(function(err) {
        console.log(err);
      });

      $scope.nuevaCampana = function(){
        $state.go('nueva_campana');
      };

      //var size = 'lg';

      $scope.verCampana = function(campana) {
          //console.log(campana);

          $scope.view_campana = campana;

          var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'app/ventas/modalVerDetallesCampana.html',
            controller: 'verDetallesCampanaCtrl',
            size: 'lg',
            resolve: {
              campana: function () {
                return $scope.view_campana;
              }
            }
          });

          modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
          }, function () {
            $log.info('Modal dismissed at: ' + new Date());
          });
        
      };

      $scope.volverMain = function() {
        $state.go('main-ventas');
      };
    
    }

    function verDetallesCampanaCtrl($scope, $state, $stateParams, $http, $uibModalInstance, NgTableParams, logger, campana){

      $scope.campana = campana;
      //console.log($scope.campana);

      $scope.form = {
        nombre_campana: $scope.campana.CAMPANA,
        cliente_campana: $scope.campana.NOMBRE_CLIENTE,
        tipo_campana: $scope.campana.TIPO_CAMPANA,
        estado_campana: $scope.campana.ESTADO_CAMPANA,
        inicio_campana: $scope.campana.CAMPANA_FECHA_INICIO,
        fin_campana: $scope.campana.CAMPANA_FECHA_FIN
      };

      /*
      $http({
        method: 'GET',
        url: config.url_service + '/getData/',
        params: { collection: 'clientes_sinc_t' }
      })
      .then(function (result, status) {
        $scope.clientes_array = result.data;
      })
      .catch(function(err) {
        console.log(err);
      });
      */

      $scope.volverTabla = function() {
        $uibModalInstance.dismiss("cancel");
      };

    };

    function cargaCampanasCtrl($scope, $state, $stateParams, $http, NgTableParams, logger) {

      //console.log($stateParams.id);

      $scope.recursos_array = [];

      $scope.form = {
        "nombre_campana": "",
        "nombre_cliente": "",
        "tipo_campana": "",
        "fecha_ini_campana": "",
        "fecha_fin_campana": "",
        "script_campana": "",
        "esquema_de_datos": "",
        "informes_cliente": "",
        "no_call": "",
        "formulario_campana": "",
        "descripcion_proceso": "",
        "req_hardware": "",
        "req_software": "",
        "tipo_discador": "",
        "notas_campana": "",
        "moneda": "",
        "iva": "",
        "costo_telefonico": "",
        "forma_pago": "",
        "clausula_indem": ""
      };

      // Trae a todos los clientes disponibles en la tabla Clientes
      var getClientesCampanas = {
        collection: 'clientes_sinc_t'
      };

      $http({
        method: 'GET',
        url: config.url_service + '/getData/',
        params: getClientesCampanas
      })
      .then(function (result, status) {
                //console.log(result.data);
                $scope.clientes_array = result.data;
              }).catch(function(err) {
                console.log(err);
              }); 

      // Al selecionar un Cliente se colocaran los datos en la Vista por medio de esta funcion
      $scope.onSelectCliente = function(item) {
        //console.log(item);
        
        $scope.cliente_id = item._id;
        $scope.cliente_nombre = item.NOM_COM;
        
        $http({
          method: 'GET',
          url: config.url_service + '/getContrato',
          params: { collection: 'contratos', cliente_data: $scope.cliente_id }
        })
        .then(function (result, status) {
          //console.log(result.data);
           //= data.data[0]._id;
           result.data.forEach((currValue) => {
            if(currValue.cliente_data.id == $scope.cliente_id) {
                //console.log(currValue._id);
                $scope.ref_contrato = currValue._id;     
              }
            });
         })
        .catch(function(err) {
          console.log(err);
        });

      };



      $scope.agregarRowRecurso = function() {

        $scope.recurso_obj = {
          perfil: $scope.perfilSelected,
          nivel: $scope.nivelSelected,
          expertise: $scope.expertiseSelected,
          carga_horaria: $scope.horarioSelected,
          turno: $scope.turnoSelected,
          cantidad: $scope.cantidadSelected
        };

        //console.log($scope.recurso_obj);
        if($scope.perfilSelected == undefined){
          logger.logError("No se ha seleccionado el perfil del recurso solicitado");
        }

        if($scope.nivelSelected == undefined){
          logger.logError("No se ha seleccionado el nivel del recurso solicitado");
        }

        if($scope.expertiseSelected == undefined){
          logger.logError("No se ha seleccionado el expertise del recurso solicitado");
        }

        if($scope.horarioSelected == undefined){
          logger.logError("No se ha seleccionado el horario del recurso solicitado");
        }

        if($scope.turnoSelected == undefined){
          logger.logError("No se ha seleccionado el turno del recurso solicitado");
        }

        if($scope.cantidadSelected == undefined || $scope.cantidadSelected == 0){
          logger.logError("No se ha seleccionado la cantidad de recursos solicitados");
        }

        else {
          $scope.recursos_array.push($scope.recurso_obj);
        }
      };

      $scope.quitarRowRecurso = function() {
        $scope.recursos_array.pop();
      };

      $scope.recurso = {};

      // Cancela el Contrato Actual y envia al operador a la vista Campañas y Contratos
      $scope.volverContrCamps = function() {

        var conf = confirm('¿Desea abandonar el modulo actual?');

        if(conf){  
          $state.go('tabla_campanas');
        }
      };

      // Guarda la Asociación actual y envia al operador hacia la vista Campañas y Contratos
      $scope.asociarCampana = function() {

        var objRegistro = {
          "CAMPANA": $scope.form.nombre_campana,
          "NOMBRE_CLIENTE": $scope.cliente_nombre,
          "CLIENTE_ID": $scope.cliente_id,
          "CONTRATO": $scope.ref_contrato,
          "TIPO_CAMPANA": $scope.form.tipo_campana,
          "ESTADO_CAMPANA": $scope.form.estado_campana,
          "CAMPANA_FECHA_INICIO": $scope.form.fecha_ini_campana.toLocaleString().slice(0, $scope.form.fecha_ini_campana.toLocaleString().lastIndexOf(',')),
          "CAMPANA_FECHA_FIN": $scope.form.fecha_fin_campana.toLocaleString().slice(0, $scope.form.fecha_fin_campana.toLocaleString().lastIndexOf(',')),
          "SCRIPT_CAMPANA": $scope.form.script_campana,
          "ESQUEMA_DE_DATOS": $scope.form.esquema_de_datos,
          "INFORMES_REPORTES": $scope.form.informes_cliente,
          "NO_CALL": $scope.form.no_call,
          "FORMULARIO_CAMPANA": $scope.form.formulario_campana,
          "DESCRIPCION_PROCESO": $scope.form.descripcion_proceso,
          "RECURSOS": $scope.recursos_array,
          "REQUERIMIENTO_HARD": $scope.form.req_hardware,
          "REQUERIMIENTO_SOFT": $scope.form.req_software,
          "TIPO_DE_DISCADOR": $scope.form.tipo_discador,
          "NOTAS": $scope.form.notas_campana,
          "MONEDA": $scope.form.moneda,
          "IVA": $scope.form.iva,
          "COSTO_TELEFONICO": $scope.form.costo_telefonico,
          "FORMA_PAGO": $scope.form.forma_pago,
          "CLAUSULA_INDEM": $scope.form.clausula_indem
        };
        console.log(objRegistro);
        
        $http({
          method: 'POST',
          url: config.url_service + '/setData',
          data: {collection: "campanas" , registro: objRegistro }
      })
        .then(function(result) {
          $state.go('tabla_campanas');
      })
        .catch(function(err) {
          console.log(err)
      });
      
    };

  }   

  function uploadContratoCtrl($scope, $state, $stateParams, $http, NgTableParams, logger, FileUploader) {
    $scope.uploader = new FileUploader({
              url: config.url_service + '/uploadFile' // POST request will be handled by Multer
            })
  };

  


  function responsablesComercialesCtrl ($scope, $state, $stateParams, $http, $uibModal, $log, $route, $routeParams, $location, NgTableParams, logger) {


    $scope.volverMain = function() {
      $state.go('main-ventas');
    }
  }


  function tablaComercialesCardinalCtrl($scope, $state, $stateParams, $http, $uibModal, $log, NgTableParams, logger){

    $scope.items = ['item1', 'item2', 'item3'];
    $scope.tableComerciales;

    $scope.animationsEnabled = true;

        //$scope.open
        $scope.nuevoComercial = function (size) {

          var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'app/ventas/modalCargaComercialCardinal.html',
            controller: 'cargaComercialesCardinalCtrl',
            size: size,
            resolve: {
              items: function () {
                return $scope.items;
              }
            }
          });

          modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
          }, function () {
            $log.info('Modal dismissed at: ' + new Date());
          });
        };

        $scope.toggleAnimation = function () {
          $scope.animationsEnabled = !$scope.animationsEnabled;
        };


        $http({
          method: "GET",
          url: config.url_service + "/getData",
          params: { collection: "tabla_comerciales_cardinal" }
        })
        .then((result) => {
          console.log(result.data);

          $scope.tableComerciales = new NgTableParams({
            page: 1,
            count: 10,
            sorting: { PUESTO: 'asc' }
          }, {
            dataset: result.data
          });
        })

        $scope.volverMain = function() {
          $state.go('main-ventas');
        }
      };



      function cargaComercialesCardinalCtrl($scope, $state, $stateParams, $http, $uibModalInstance, items, NgTableParams, logger){
        $scope.items = items;

        $scope.selected = {
          item: $scope.items[0]
        };

        $scope.comercial = {
          puesto: "",
          nombre_apellido: "",
          telefono: "",
          email: ""
        };

        //cancelarAlta()
        $scope.guardarComercial = function() {

          var record_comercial = {
            "PUESTO": $scope.comercial.puesto,
            "NOMBRE_APELLIDO": $scope.comercial.nombre_apellido,
            "TELEFONO": $scope.comercial.telefono,
            "EMAIL": $scope.comercial.email
          }

          console.log(record_comercial);

          $http({
            method: "POST",
            url: config.url_service + '/setData',
            data: { collection: 'tabla_comerciales_cardinal', registro: record_comercial }    
          })
          .then((result) => {
            //console.log(result);
            //$state.go('tabla-comerciales');
            $http({
              method: "GET",
              url: config.url_service + "/getData",
              params: { collection: "tabla_comerciales_cardinal" }
            })
            .then((result) => {
              console.log(result.data);
                //$uibModalInstance.dismiss("cancel");
              })
          })  
        };

        $scope.cancelarAlta = function() {
          $uibModalInstance.dismiss("cancel");
        };

      };



      function tablaComercialesClientesCtrl($scope, $state, $stateParams, $http, $uibModal, $log, NgTableParams, logger){

        $scope.items = ['item1', 'item2', 'item3'];
        $scope.tableComerciales;

        $scope.animationsEnabled = true;

        //$scope.open
        $scope.nuevoComercial = function (size) {

          var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'app/ventas/modalCargaComercialCliente.html',
            controller: 'cargaComercialesClientesCtrl',
            size: size,
            resolve: {
              items: function () {
                return $scope.items;
              }
            }
          });

          modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
          }, function () {
            $log.info('Modal dismissed at: ' + new Date());
          });
        };

        $scope.toggleAnimation = function () {
          $scope.animationsEnabled = !$scope.animationsEnabled;
        };


        $http({
          method: "GET",
          url: config.url_service + "/getData",
          params: { collection: "tabla_comerciales_clientes" }
        })
        .then((result) => {
          console.log(result.data);

          $scope.tableComerciales = new NgTableParams({
            page: 1,
            count: 10,
            sorting: { NOMBRE_CLIENTE: 'asc' }
          }, {
            dataset: result.data
          });
        })

      };



      function cargaComercialesClientesCtrl($scope, $state, $stateParams, $http, $uibModalInstance, items, NgTableParams, logger){
        $scope.items = items;

        $scope.selected = {
          item: $scope.items[0]
        };

        $http({
          method: 'GET',
          url: config.url_service + '/getData/',
          params: { collection: 'clientes_sinc_t' }
        })
        .then(function (result, status) {
          $scope.clientes_array = result.data;
        })
        .catch(function(err) {
          console.log(err);
        });

        $scope.onSelectCliente = function(item) {
        //console.log(item)
        $scope.cliente_nombre = item.NOM_COM;
        $scope.cliente_id = item._id;
      };    

      $scope.comercial_cliente = {
        puesto: "",
        perfil: "",
        nombre_apellido: "",
        telefono: "",
        email: "",
        skype_id: ""
      };


      $scope.guardarComercial = function() {

        var record_comercial_cliente = {
          "NOMBRE_CLIENTE": $scope.cliente_nombre,
          "CLIENTE_ID": $scope.cliente_id,
          "PUESTO": $scope.comercial_cliente.puesto,
          "PERFIL": $scope.comercial_cliente.perfil,
          "NOMBRE_APELLIDO": $scope.comercial_cliente.nombre_apellido,
          "TELEFONO": $scope.comercial_cliente.telefono,
          "EMAIL": $scope.comercial_cliente.email,
          "SKYPE_ID": $scope.comercial_cliente.skype_id
        };

        console.log(record_comercial_cliente);

        
        $http({
          method: "POST",
          url: config.url_service + '/setData',
          data: { collection: 'tabla_comerciales_clientes', registro: record_comercial_cliente }    
        })
        .then((result) => {
            //console.log(result);
            $http({
              method: "GET",
              url: config.url_service + "/getData",
              params: { collection: "tabla_comerciales_clientes" }
            })
            .then((result) => {
              console.log(result.data);
              $state.go('tabla-comerciales');
              $uibModalInstance.dismiss("cancel");
            })
          })
      };

      $scope.cancelarAlta = function() {
        $uibModalInstance.dismiss("cancel");
      };
    };


  })();

;
(function () {
    'use strict';

    angular.module('app')
        .controller('profileCtrl', [ '$scope', '$state', '$stateParams', '$http', profileCtrl]);

    function profileCtrl($scope, $state, $stateParams, $http) {

          var app;
          app = $('#app');

          if (app.hasClass('nav-collapsed-min')) {
                app.removeClass('nav-collapsed-min');
          }

          var nav;
          nav = $('#nav');

          if (nav.hasClass('hidden')) {
                nav.removeClass('hidden');
          }

      }
})();

;
(function () {
    'use strict';

    angular.module('app.importacion', ['ui.router', 'ngCsvImport']);
})(); 
;
(function () {
  'use strict';

  angular.module('app.importacion')
        .directive('fileReader', function() {
          return {
            scope: {
              fileReader:"="
            },
        link: function(scope, element) {
          $(element).on('change', function(changeEvent) {
            var files = changeEvent.target.files;
              if (files.length) {
                //console.log(files);
            var r = new FileReader();
              r.onload = function(e) {
                //var contents = e.target.result.slice(0, e.target.result.indexOf("\n"));
              var contents = e.target.result.substr(0, e.target.result.indexOf("\n"));              
                //console.log(contents);  
                scope.$apply(function () {
                    scope.fileReader = contents;
                  });
                };
                r.readAsText(files[0]);
              }
          });
      }
    }; 
  })         
  .controller('importListCtrl', ['$http','$scope', '$state', '$stateParams', 'logger', importListCtrl])
  .controller('importCampanaCtrl', ['$scope', '$state', '$stateParams', '$http', 'NgTableParams', 'logger', 'FileUploader', importCampanaCtrl]);

  function importListCtrl( $http, $scope, $state, $stateParams, logger) {

    var app;
    app = $('#app');

    if (app.hasClass('nav-collapsed-min')) {
      app.removeClass('nav-collapsed-min');
    }

    var nav;
    nav = $('#nav');

    if (nav.hasClass('hidden')) {
      nav.removeClass('hidden');
    }

    // Trae a todos los clientes disponibles en la tabla Clientes
      var getClientesCampanas = {
        collection: 'clientes_sinc_t'
      };

      $http({
        method: 'GET',
        url: config.url_service + '/getData/',
        params: getClientesCampanas
      })
      .then(function (data, status) {
                //console.log(data.data);
                $scope.clientes_array = data.data;
              }).catch(function(err) {
                console.log(err);
              }); 

      // Al selecionar un Cliente se colocaran los datos en la Vista por medio de esta funcion
      $scope.onSelectCliente = function(item) {
        
        $scope.cliente_id = item._id;
        /*$scope.cliente_nombre = item.NOM_COM;
        $scope.direccionComercial = item.DIR_COM;*/
        //$scope.telefonoComercial = item.telefono;
            $http({
                method: "GET",
                url: config.url_service + '/getData',
                params: { collection: "campanas" }
            })
            .then((resullt) => {
                //console.log(resullt.data);
                $scope.campanas_array = [];
                resullt.data.forEach((currVal) => {
                    if(currVal.CLIENTE_ID == $scope.cliente_id) {
                        $scope.campanas_array.push(currVal);
                    }   
                })
            })
      };

      $scope.onSelectCampana = function(item) {
        //console.log(item);
        $scope.campana_seleccionada = item._id;
      }

    $scope.getContent = function(value){
          //console.log($scope.fileContent.split(','));
          if($scope.fileContent === undefined) {
            logger.logError("Seleccione un archivo para comenzar la importación.");
          } else {

          $scope.variable_var = $scope.fileContent.split(',');
          $scope.array_csv_file = [];
          $scope.variable_var.forEach(function(thisVal) {
              //console.log(thisVal);
              $scope.array_csv_file.push(thisVal);
            });
          //console.log(value);
          
          var datos = {
            collection: 'esquemas'
          };
          $http({
            method: 'GET',
            url: config.url_service + '/getData',
            params: datos
          })
          .then(function(datos) {
              //console.log(datos.data[0]);
              $scope.array_esquema = datos.data[0].esquema;
            })
          }
        } 

        $scope.itemsArrayImportar = [];
        $scope.itemsArrayEsquema  = [];
        
        $scope.itemsNuevoArrayEsquema  = [];
        $scope.itemsNuevoCampoArray = [];
        //{id: 'choice1'}
        $scope.camposAgregados = [];
        
        $scope.addNewChoice = function() {
          var newItemNo = $scope.camposAgregados.length+1;
          $scope.camposAgregados.push({'id':'choice'+newItemNo});
        };

        $scope.removeChoice = function() {
          var lastItem = $scope.camposAgregados.length-1;
          $scope.camposAgregados.splice(lastItem);
        };

        $scope.submitRelaciones = function(){

          //console.log($scope.itemsNuevoCampoArray);
          //console.log($scope.itemsNuevoArrayEsquema);
          //console.log($scope.itemsArrayEsquema);

            if($scope.array_esquema === undefined) {
              logger.logError("No hay campos para realizar el mapeo");
            }

            else {

            var objEsq = {};
            $scope.arrNuevo = [];
            
            $scope.array_esquema.forEach(function(currEsq, index) {
              objEsq.datoEsq = currEsq;//$scope.itemsArrayEsquema[index];
              objEsq.numEsq  = $scope.itemsArrayEsquema[index];
              $scope.arrNuevo.push(objEsq);
              objEsq = {};
            });
            //console.log($scope.arrNuevo);

            var objImp = {};
            $scope.arrImp = [];

            $scope.array_csv_file.forEach(function(currImp, index) {
              objImp.datoEsq = currImp;
              objImp.numEsq  = $scope.itemsArrayImportar[index];
              $scope.arrImp.push(objImp);
              objImp = {};
            });
            //console.log($scope.arrImp);

            var objNewImp = {};
            $scope.arrNuevoCamp = [];
            
            $scope.itemsNuevoCampoArray.forEach(function(currNewImp, index) {
              objNewImp.datoEsq = currNewImp;
              objNewImp.numEsq = $scope.itemsNuevoArrayEsquema[index];
              $scope.arrNuevoCamp.push(objNewImp);
              objNewImp = {};
            });
            //console.log($scope.arrNuevoCamp);

            $scope.mapeo_array = [];
            var objMapeo = {};
            $scope.arrNuevo.forEach(function(currEsquema) {
              $scope.arrImp.forEach(function(currImport) {
                if(currEsquema.numEsq == currImport.numEsq){
                  objMapeo.campos_en_archivo = currImport.datoEsq;
                  objMapeo.campos_en_esquema = currEsquema.datoEsq;
                  $scope.mapeo_array.push(objMapeo);
                  objMapeo = {};
                }
              });  
            }); 
            //console.log($scope.mapeo_array);

            $scope.arrNuevoCamp.forEach(function(currNewField) {
              $scope.arrImp.forEach(function(currImport) {
                if(currNewField.numEsq == currImport.numEsq){
                  objMapeo.campos_en_archivo = currImport.datoEsq;
                  objMapeo.campos_en_esquema = currNewField.datoEsq;
                  $scope.mapeo_array.push(objMapeo);
                  objMapeo = {};
                }
              });
            });          
            //console.log($scope.mapeo_array);
            } 
          }

          $scope.cancelarModulo = function(){
            var conf = confirm("¿Desea abandonar el modulo actual?");
            if(conf){
              $state.go("main-ventas");
            }
          }

          $scope.realizarMapeo = function(){
            //console.log($scope.mapeo_array);
            if($scope.mapeo_array.length == 0) {
              logger.logError('Mapeo no realizado, imposible guardar registro.');
            };

            //$scope.array_csv_file.reduce()

            var datos_originales = $scope.array_csv_file.reduce((o, v, i) => {
                o[i] = v;
                //console.log(o);
                return o;
            }, {});

            //console.log(datos_originales);

            var objRegistro = {
              "DATOS_MAPEADOS": $scope.mapeo_array,
              "CAMPANA": $scope.campana_seleccionada,
              "CLIENTE": $scope.cliente_id,
              "esquema_de_datos": datos_originales,
              "file_header": $scope.array_csv_file
            };

            console.log(objRegistro);

            
            $http({
              method: 'POST',
              url: config.url_service + '/setData',
              data: { collection: 'esquemas_campanas', registro: objRegistro }
            })
              .then(function(result) {
                console.log(result);
                logger.logSuccess('El mapeo fue realizado con exito');
                return result;
              })
              .then(
                (result) => {
                  $state.go('main-ventas')
              })
              .catch(function(err) {
                console.log(err); 
              })
              
          }; 
        }
        
        function importCampanaCtrl($scope, $state, $stateParams, $http, NgTableParams, logger, FileUploader) {
          
            // Trae a todos los clientes disponibles en la tabla Clientes
      var getClientesCampanas = {
        collection: 'clientes_sinc_t'
      };

      $http({
        method: 'GET',
        url: config.url_service + '/getData/',
        params: getClientesCampanas
      })
      .then(function (data, status) {
                //console.log(data.data);
                $scope.clientes_array = data.data;
              }).catch(function(err) {
                console.log(err);
              }); 

      // Al selecionar un Cliente se colocaran los datos en la Vista por medio de esta funcion
      $scope.onSelectCliente = function(item) {
        
        $scope.cliente_id = item._id;
        /*$scope.cliente_nombre = item.NOM_COM;
        $scope.direccionComercial = item.DIR_COM;*/
        //$scope.telefonoComercial = item.telefono;
            $http({
                method: "GET",
                url: config.url_service + '/getData',
                params: { collection: "campanas" }
            })
            .then((resullt) => {
                //console.log(resullt.data);
                $scope.campanas_array = [];
                resullt.data.forEach((currVal) => {
                    if(currVal.CLIENTE_ID == $scope.cliente_id) {
                        $scope.campanas_array.push(currVal);
                    }   
                })
            })
      };

      $scope.onSelectCampana = function(item) {
        //console.log(item);
        $scope.campana_seleccionada = item._id;
      }


          $scope.uploader = new FileUploader({
              url: config.url_service + '/uploadFile' // POST request will be handled by Multer
          }); //{ cliente_id: $scope.cliente_id, campana_id: $scope.campana_seleccionada }

          $scope.uploader.onBeforeUploadItem = onBeforeUploadItem;
          $scope.uploader.onSuccessItem = onSuccessItem;

          function onBeforeUploadItem(item) {
            //if(item.formData.length == 0) {
                item.formData = [];
                item.formData.push({cliente_id: $scope.cliente_id, campana_id: $scope.campana_seleccionada});
                console.log(item.formData);
            //}
          };

          function onSuccessItem(item, response, status, headers) {
              //console.log(response);
              $state.go('importador-campanas');
          }

          $http({
            method: "GET",
            url: config.url_service + "/getData",
            params: {collection: "tabla_importacion"}
          })
          .then((resultado) => {
                //console.log(resultado.data);
                $scope.archivos = resultado.data;
          })
 
          $scope.check_head = true;
          $scope.pickChosen = 0;

          $scope.validarCabecera = function(index , file) {
            //console.log(index);
            //console.log(file);

            $http({
                method: "GET",
                url: config.url_service + '/headValidation',
                params: {file: file.archivo}
            })
            .then((result) => {
                console.log(result);
                if(result.status == 200) {
                    $scope.check_head = false;
                    $scope.pickChosen = 1;
                    
                }
            })
            .catch((err) => {
                console.log(err);
                logger.logError(err.data.desc);
            });
            
          };

          $scope.import_ok = 0;

          $scope.realizarImport = function(file) {

            $http({
                method: "GET",
                url: config.url_service + '/readFile',
                params: {file: file.archivo}
            })
            .then((result) => {
                console.log(result);
                if(result.status == 200) {
                    $scope.import_ok = 1;
                }
            })
            .catch((err) => {
                console.log(err);
            });

          };

          $scope.returnVentas = function(){
            $state.go('main-ventas');
          }

        };
})(); 




;
(function () {
    'use strict';

    angular.module('app')
        .config(function($stateProvider, $urlRouterProvider) {
            $stateProvider
              .state('login', {
                url: "page/signin",
                templateUrl: "app/page/signin.html"
              })
        })
    .controller('userData', ['$scope', '$state', '$stateParams', '$http', userData]);
    
    function userData($scope, $state, $stateParams, $http) {

    	//console.log("hola mundo");
 
        var app;
        app = $('#app');
        app.addClass('nav-collapsed-min');

        var nav;
        nav = $('#nav');
        nav.addClass('hidden');
 
        var token = {
                token: window.sessionStorage.getItem("token")
            };

        $http({
            method: 'GET',
            url: config.url_service + '/userData',
            params: token
        }).then(function(data) {
            console.log(data.data);
            $scope.datas = data.data[0];
        })
        
 
        $scope.menusFunction =  function(appName){
             console.log(appName);

            $http({
               method: 'GET', 
               url: config.url_service + '/getMenus' ,
               params: { menu: appName } 
            })
            .then(function(result) {
                //console.log(result.data);
                //console.log(result);
                
                result.data.forEach(function(currentValue) {
		            if(appName === currentValue.name) {
                        //console.log(currentValue);
                        $scope.main.menus = currentValue;
                    }          
                });
            })
            .catch(function(err) {
                console.log(err);
            })
        };
    };


})();       
;
(function () {
  'use strict'; 

 angular.module('app')
  	.config(function($stateProvider, $urlRouterProvider) {
    	$stateProvider
    		.state('main-admin', {
      				url: "settings/administracion",
      				templateUrl: "app/settings/administracion.html"
    		})
   	})
   	.controller('administracionCtrl', [ '$scope', '$state', '$stateParams', '$http', administracionCtrl])
    //.controller('gruposCtrl', ['$scope', '$state', '$stateParams', '$http', 'NgTableParams', gruposCtrl])
    .controller('sincronizacionesCtrl', ['$scope', '$state', '$stateParams', '$http', 'NgTableParams', sincronizacionesCtrl]);

   	function administracionCtrl($scope, $state, $stateParams, $http) {
   		//console.log("hola mundo")

   		var app;
 	    app = $('#app');

    	if (app.hasClass('nav-collapsed-min')) {
      		app.removeClass('nav-collapsed-min');
   		};

   		var nav;
   		nav = $('#nav');

    	if (nav.hasClass('hidden')) {
      		nav.removeClass('hidden');
    	};
    	
   		$http({
   			method: 'GET',
   			url: config.url_service + '/getMenus',
   			params: {menu: "Administracion"}
   		})
   		  .then(function(result) {
   		  		//console.log(result.data);
   		  		$scope.datas = result.data[0].submenus;
   		  })
   		  .catch(function(err) {
   		  		console.log(err);
   		  })
   	}

    function gruposCtrl($scope, $state, $stateParams, $http, NgTableParams) {

        $http({
            method: 'GET',
            url: config.url_service + '/getGroupUsers',
            })
              .then(function (data, status) { 
                //console.log(data.data);    
                $scope.usuarios = data.data;
              }); 

      $scope.replicarAd = function() {
        
        $http({
            method: 'GET',
            url: config.url_service + '/getGroupUsers',
          })
            .then(function (data, status) {
            //console.log(data.data);
            $scope.usuarios = data.data;
            
            });
         }

        }

    function sincronizacionesCtrl($scope, $state, $stateParams, $http, NgTableParams) {
        /*
        $http({
            method: 'GET',
            url: config.url_service + '/getData',
            params: {collection: 'clientes_sinc_t'}
          })
            .then(function (result) {
              //console.log(result.data);
              $scope.clientes = result.data;
            });
         

        $scope.sincTango = function() {
          
          $http({
            method: 'GET',
            url: config.url_service + '/getClientsTango',
          })
            .then(function (result) {
              //console.log(result.data);
              $scope.clientes = result.data.registros;
            });

          };*/
          $scope.pickChosen = 0;
          $scope.pickAd = 0;

          $scope.sincTango = function(){

            $http({
                method: 'GET',
                url: config.url_service + '/getClientsTango',
            })
              .then(function (result) {
                //console.log(result.data);
                //$scope.clientes = result.data.registros;
                if(result.data.status == 200){
                    $scope.pickChosen = 1;
                    $scope.sincroSuccessIcon = "ti-check-box";
                    $scope.sincroSuccess = "Sincronización Exitosa";
                  };
              });
          };


          $scope.sincAd = function(){
            
            $http({
                method: 'GET',
                url: config.url_service + '/getGroupUsers',
            })
              .then(function (data, status) {
              console.log(data);
              //$scope.usuarios = data.data;
              if(data.status == 200){
                    $scope.pickAd = 1;
                    $scope.sincroAdSuccessIcon = "ti-check-box";
                    $scope.sincroAdSuccess = "Sincronización Exitosa";
                  };
            });
          };

          $scope.returnAdmin = function(){
            $state.go('main-admin');
          };

      }
        
         
})();
;
(function () {
  'use strict'; 

  angular.module('app')
  	.controller('tablaClientesCtrl', ['$scope', '$state', '$stateParams', '$http', '$uibModal', '$log', 'NgTableParams', 'logger', tablaClientesCtrl])
  	.controller('nuevoClienteCtrl', ['$scope', '$state', '$stateParams', '$http', '$uibModalInstance', 'NgTableParams', 'logger', nuevoClienteCtrl]);

  	function tablaClientesCtrl($scope, $state, $stateParams, $http, $uibModal, $log, NgTableParams, logger) {

      $http({
        method: 'GET',
        url: config.url_service + '/getData',
        params: { collection: 'crm_clientes' }
      })
      .then(
        (result) => {
          console.log(result.data);
        });


  		$scope.cargaCliente = function() {
	  		var modalInstance = $uibModal.open({
	              animation: $scope.animationsEnabled,
	              templateUrl: 'app/clientes/modalCargaCliente.html',
	              controller: 'nuevoClienteCtrl',
	              size: 'lg'
	            });
  		}


  		$scope.volverMain = function() {
  			$state.go('main-ventas');
  		}
  	}




  	function nuevoClienteCtrl($scope, $state, $stateParams, $http, $uibModalInstance, NgTableParams, logger) {

      $scope.contactos_cliente_array = [];
      $scope.contactos_cardinal_array = [];

  		$scope.form = {
  			cliente: "",
  			cuit: "",
  			dir_com: "" 
  		};

  		$http({
  			method: 'GET',
  			url: config.url_service + '/getData',
  			params: { collection: 'clientes_sinc_t'}
  		})
  		.then(
  			(result) => {
  				//console.log(result.data);
  				$scope.clientes_array = result.data;
  		})

  		$scope.onSelectCliente = function(item) {
  			//console.log(item);
        $scope.CLIENTE_NOMBRE = item.NOM_COM;
        $scope.CLIENTE_ID = item._id;
  			$scope.form.cuit = item.CUIT;
  			$scope.form.dir_com = item.DIR_COM;
  		}

      $scope.agregarResponsableCliente = function() {

        $scope.contacto_cliente = {
          responsable: $scope.responsableSelected,
          puesto: $scope.puestoSelected,
          perfil: $scope.perfilSelected,
          nombre_apellido: $scope.nombre_apellido,
          telefono: $scope.telefono,
          email: $scope.email,
          skype_id: $scope.skype_id
        };

        $scope.contactos_cliente_array.push($scope.contacto_cliente);
      };

      $scope.quitarResponsableCliente = function() {
        $scope.contactos_cliente_array.pop();
      };

      $scope.recurso = {};

      $scope.agregarResponsableCardinal = function() {

        $scope.contacto_cardinal = {
          puesto: $scope.cardinalpuestoSelected,
          nombre_apellido: $scope.cardinal_nombre_apellido,
          telefono: $scope.cardinal_telefono,
          email: $scope.cardinal_email
        };

        $scope.contactos_cardinal_array.push($scope.contacto_cardinal);
      };

      $scope.quitarResponsableCardinal = function() {
        $scope.contactos_cardinal_array.pop();
      };

      $scope.recurso = {};


  		$scope.cancelarCarga = function() {
  			$uibModalInstance.dismiss("cancel");
  		};

	 	  $scope.guardarCliente = function() {

		    var objRegistro = {
          CLIENTE_NOMBRE: $scope.CLIENTE_NOMBRE,
          CLIENTE_ID: $scope.CLIENTE_ID,
          CLIENTE_RESPOSABLES: $scope.contactos_cliente_array,
          CARDINAL_RESPOSABLES: $scope.contactos_cardinal_array,
          SERVICIO_BRINDADO: {
            SERVICIO: $scope.servicioSelected,
            TIPO: $scope.servicioTypeSelected,
            RESP_CARDINAL: $scope.cardinalRespSelected,
            RESP_CLIENTE: $scope.clienteRespSelected
          } 
        }
        console.log(objRegistro);

        $http({
          method: 'POST',
          url: config.url_service + '/altaCliente',
          data: { collection: 'crm_clientes', record: objRegistro}
        })
        .then((result) => {
          console.log(result.data);
        })
      };
  	

    }

})();
;
(function () {
	'use strict'; 

	angular.module('app')
	.controller('asignacionCtrl', ['$scope', '$state', '$stateParams', '$http', '$uibModal', '$log', 'NgTableParams', 'logger', asignacionCtrl]);

	function asignacionCtrl($scope, $state, $stateParams, $http, $uibModal, $log, NgTableParams, logger) {

		$scope.models = {
		selected: null,
		templates: [
		{type: "item", id: 2},
		{type: "container", id:1, columns: [[]]}
		],
		dropzones: {
			"Estados": [],
			"Operadores": []
			}
		};
		


		$http({
			method: 'GET',
			url: config.url_service + '/getData',
			params: { collection: 'clientes_sinc_t'}
		})
		.then(
			(result) => {
				//console.log(result.data);
				$scope.clientes_array = result.data; 
			});

		$scope.onSelectCliente = (item) => {
			//console.log(item);
			$scope.CLIENTE_ID = item._id;
			$scope.CLIENTE_NOMBRE = item.NOM_COM;

			$http({
                method: "GET",
                url: config.url_service + '/getData',
                params: { collection: "campanas" }
            })
            .then((result) => {
 
                $scope.campanas_array = [];
                
                result.data.forEach((currVal) => {
                    
                    if(currVal.CLIENTE_ID == $scope.CLIENTE_ID) {
                        $scope.campanas_array.push(currVal);
                    }
                });
            });
		};

		$scope.onSelectCampana = (item) => {
			//console.log(item);
			$scope.CAMPANA_ID = item._id;
			$scope.CAMPANA_NOMBRE = item.CAMPANA;
		};

		$http({
			method: 'GET',
			url: config.url_service + '/getData',
			params: { collection: 'estados_por_campana'}
		})
		.then(
			(result) => {
				//console.log(result.data[0].ESTADOS);
				$scope.obj_state = {};
				result.data[0].ESTADOS.forEach(
					(currState) => {
						$scope.obj_state.id = currState;
						$scope.obj_state.type = "container";
						$scope.obj_state.columns = [[]];
						$scope.models.dropzones.Estados.push($scope.obj_state);
						$scope.obj_state = {};
					});
			});

		$http({
			method: 'GET',
			url: config.url_service + '/getData',
			params: { collection: 'tabla_operadores'}
		})
		.then(
			(result) => {
				//console.log(result.data);
				$scope.obj_ops = {};
				result.data.forEach(
					(currOps) => {
						//console.log(currOps);
						$scope.obj_ops.type = "item";
						$scope.obj_ops.id = currOps.NOMBRE;
						$scope.obj_ops._id = currOps._id;
						$scope.models.dropzones.Operadores.push($scope.obj_ops);
						$scope.obj_ops = {};
				})
		});

		$scope.asignarCampana = () => {
			//console.log($scope.models.dropzones.Estados);

			var objRegistro = {
				CLIENTE: $scope.CLIENTE_NOMBRE,
				CLIENTE_ID: $scope.CLIENTE_ID,
				CAMPANA: $scope.CAMPANA_NOMBRE,
				CAMPANA_ID: $scope.CAMPANA_ID,
				ESTADOS_ASIGNADOS: $scope.models.dropzones.Estados
			};

			//console.log(objRegistro);

			$http({
				method: 'POST',
				url: config.url_service + '/asignarCampana',
				data: { collection: 'campanas_asignadas', campana_asignada: objRegistro}
			})
			.then(
				(result) => {
					console.log(result.data);
					$state.go('campanas_asignadas');
				});
		}

		$scope.$watch('models.dropzones', function(model) {
			$scope.modelAsJson = angular.toJson(model, true);
		}, true);


		$scope.cancelarModulo = () => {
			$state.go('campanas_asignadas');
		}
	}

})();
;
(function () {
	'use strict';

	angular.module('app')
		.config(function($httpProvider , $stateProvider, $urlRouterProvider) {
			$stateProvider
			  .state('index', {
				url: "main/aplicaciones",
				templateUrl: "app/main/aplicaciones.html",
				params: {token: null}
			  });
			$httpProvider.defaults.withCredentials = true;
		})
		.controller('signIn', ['$rootScope','$scope', '$state', '$http', 'logger', 'md5', signIn]);

	

	function signIn($rootScope, $scope, $state, $http, logger, md5) {			

		console.log("CALOR CALOR");

		$scope.loginFunction = function(username, userpass){

			if(config.authType) {
			
			var info = {username: username, password: userpass};
					
			$http.post(config.url_service + '/login', info/*, {withCredentials: true}*/).then(function(datos) {

				$scope.main.name = datos.data.name;
				
				window.sessionStorage.setItem('token', datos.data.token);
				
				$state.go('index');

			}, function(err) {
				return logger.logError(err.data.descripcion);
			});
		  } else {
			
			var info = {username: username, password: md5.createHash(userpass)};
					
			$http.post(config.url_service + '/login', info/*, {withCredentials: true}*/).then(function(datos) {
						
				$scope.main.name = datos.data.name;
						
				window.sessionStorage.setItem('token', datos.data.token);
						$state.go('state1');

			}, function(err) {
				return logger.logError(err.data.descripcion);
			});
		  }
		};
	}

})();
