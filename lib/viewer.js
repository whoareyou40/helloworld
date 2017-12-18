function DMap() {


   

    //初始化天地图地图
    var tian_di_tu_satellite_layer = new ol.layer.Tile({
        source: new ol.source.XYZ({
            url: 'http://t3.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}'
        })
    });
    //初始化openstreetmap矢量图层
    var osmLayer = new ol.layer.Tile({
        source: new ol.source.OSM()
    });
    //数据源
    var vectSource = new ol.source.Vector({
    });
    //矢量要素（区）的样式
    var vectStyle = new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0.5)'
        }),
        stroke: new ol.style.Stroke({
            color: '#0099ff',
            width: 2
        }),
        image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
                color: '#0099ff'
            })
        })
    });
    //矢量图层
    var vectLayer = new ol.layer.Vector({
        source: vectSource,
        style: vectStyle,
        opacity: 0.5
    });
    //初始化地图对象
    var map;
    this.map = map;
    //初始化地图
    this.initMap = function () {
        map = new ol.Map({
            target: 'map',//地图容器div的ID
            //地图容器中加载的图层
            layers: [
                //加载瓦片图层数据
             osmLayer, tian_di_tu_satellite_layer
            ],
            //地图视图设置
            view: new ol.View({
                center: [11535264, 3849980], //地图初始中心点
                zoom: 4 //地图初始显示级别
            })
        });

        tian_di_tu_satellite_layer.setVisible(false);
    };


    // 放大地图
    this.zoomIn = function () {
        var view = map.getView();
        // 让地图的zoom增加1，从而实现地图放大
        view.setZoom(view.getZoom() + 1);
    };
    //缩小地图
    this.zoomOut = function () {
        var view = map.getView();
        // 让地图的zoom减小1，从而实现地图缩小
        view.setZoom(view.getZoom() - 1);
    };

    //移动到坐标点
    this.zoomToPoint = function (point) {
        var view = map.getView();
        view.setCenter([point.x, point.y]);
        map.render();
    };

    //缩放到指定比例
    this.zoomTo = function (zoom) {
        var view = map.getView();
        view.setZoom(zoom);
    };


    //图层切换
    this.switchMap = function(n) {
        if (n == 2) {
            tian_di_tu_satellite_layer.setVisible(true);
            osmLayer.setVisible(false);
        }
        else if (n == 1) {
            tian_di_tu_satellite_layer.setVisible(false);
            osmLayer.setVisible(true);
        }
    };

    //绘制多边形
    this.loadPolygon = function (coordinates) {
        var MUP = new ol.geom.Polygon(coordinates);
        //创建一个新的要素，并添加到数据源中
        var feature = new ol.Feature({
            geometry: MUP,
        });
        //矢量数据源
   

        //在地图中添加图层
        vectSource.addFeature(feature);
        map.addLayer(vectLayer);
    }

    //清除绘制图层
    this.cleanPolygon = function () {
        map.removeLayer(vectLayer);
    }

    //图层缩放到要素
    this.zoomToFeature = function (coordinates) {
        var MUP = new ol.geom.Polygon(coordinates);
        var view = map.getView();
        view.fit(MUP.getExtent(), map.getSize());
    }

    this.startDraw = function (callback) {
        //实例化一个矢量图层Vector作为绘制层
        var source = new ol.source.Vector({ wrapX: false });
        var vector = new ol.layer.Vector({
            source: source,
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
                }),
                stroke: new ol.style.Stroke({
                    color: '#ffcc33',
                    width: 2
                }),
                image: new ol.style.Circle({
                    radius: 7,
                    fill: new ol.style.Fill({
                        color: '#ffcc33'
                    })
                })
            })
        });
        map.addLayer(vector);//将绘制层添加到地图容器中

        addInteraction('Polygon');
        //根据绘制类型进行交互绘制图形处理
        function addInteraction(value) {
            //var value = typeSelect.value; //绘制类型
            if (value !== 'None') {
                if (source == null) {
                    source = new ol.source.Vector({ wrapX: false });
                    vector.setSource(source); //添加绘制层数据源
                }
                var geometryFunction, maxPoints;

                //实例化交互绘制类对象并添加到地图容器中
                draw = new ol.interaction.Draw({
                    source: source, //绘制层数据源
                    type: /** @type {ol.geom.GeometryType} */(value), //几何图形类型
                    geometryFunction: geometryFunction, //几何信息变更时调用函数
                    maxPoints: maxPoints //最大点数
                });
                map.addInteraction(draw);
                draw.on('drawend', callback, this);
            }
            else {
                source = null;
                vector.setSource(source);//清空绘制图形
            }
        }
    }

}

//定义点
function point(x, y) {
    this.x = x;
    this.y = y;
}







//开始绘制多边形
function startDraw(callback) {

    //实例化一个矢量图层Vector作为绘制层
    var source = new ol.source.Vector({ wrapX: false });
    var vector = new ol.layer.Vector({
        source: source,
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.2)'
            }),
            stroke: new ol.style.Stroke({
                color: '#ffcc33',
                width: 2
            }),
            image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                    color: '#ffcc33'
                })
            })
        })
    });
    map.addLayer(vector);//将绘制层添加到地图容器中

    addInteraction('Polygon');
    //根据绘制类型进行交互绘制图形处理
    function addInteraction(value) {
        //var value = typeSelect.value; //绘制类型
        if (value !== 'None') {
            if (source == null) {
                source = new ol.source.Vector({ wrapX: false });
                vector.setSource(source); //添加绘制层数据源
            }
            var geometryFunction, maxPoints;
            if (value === 'Square') {
                value = 'Circle';
                geometryFunction = ol.interaction.Draw.createRegularPolygon(4); //正方形图形（圆）
            } else if (value === 'Box') {
                value = 'LineString';
                maxPoints = 2;
                geometryFunction = function (coordinates, geometry) {
                    if (!geometry) {
                        geometry = new ol.geom.Polygon(null); //多边形
                    }
                    var start = coordinates[0];
                    var end = coordinates[1];
                    geometry.setCoordinates([
                      [start, [start[0], end[1]], end, [end[0], start[1]], start]
                    ]);
                    return geometry;
                };
            }
            //实例化交互绘制类对象并添加到地图容器中
            draw = new ol.interaction.Draw({
                source: source, //绘制层数据源
                type: /** @type {ol.geom.GeometryType} */(value), //几何图形类型
                geometryFunction: geometryFunction, //几何信息变更时调用函数
                maxPoints: maxPoints //最大点数
            });
            map.addInteraction(draw);
        }
        else {
            source = null;
            vector.setSource(source);//清空绘制图形
        }
    }
}



