"use strict";
/**
 * Converted to typescript for react-layout-generator
 * See https://photonstorm.github.io/phaser-ce/Phaser.QuadTree.html
 */
Object.defineProperty(exports, "__esModule", { value: true });
var Bounds = /** @class */ (function () {
    function Bounds(v) {
        this.x = v.x;
        this.y = v.y;
        this.width = v.width;
        this.height = v.height;
        this.subWidth = this.width / 2;
        this.subHeight = this.height / 2;
        this.right = v.x + v.width;
        this.bottom = v.y + v.height;
    }
    return Bounds;
}());
exports.Bounds = Bounds;
/**
 * QuadTree Constructor
 *
 * @class Phaser.QuadTree
 * @classdesc A QuadTree implementation. The original code was a conversion of the Java code posted to GameDevTuts.
 * However I've tweaked it massively to add node indexing, removed lots of temp. var creation and significantly increased performance as a result.
 * Original version at https://github.com/timohausmann/quadtree-js/
 * @constructor
 * @param {number} x - The top left coordinate of the quadtree.
 * @param {number} y - The top left coordinate of the quadtree.
 * @param {number} width - The width of the quadtree in pixels.
 * @param {number} height - The height of the quadtree in pixels.
 * @param {number} [maxObjects=10] - The maximum number of objects per node.
 * @param {number} [maxLevels=4] - The maximum number of levels to iterate to.
 * @param {number} [level=0] - Which level is this?
 */
// tslint:disable-next-line:max-classes-per-file
var RLGQuadTree = /** @class */ (function () {
    function RLGQuadTree(x, y, width, height, maxObjects, maxLevels, level) {
        var _this = this;
        /*
        * Populates this quadtree with the members of the given Group.
        *
        * @method Phaser.QuadTree#populate
        * @param {Phaser.Group} group - The Group to add to the quadtree.
        */
        this.populate = function (group) {
            group.forEach(function (item) { return _this.insert(item); });
        };
        // /*
        // * Handler for the populate method.
        // * 
        // * @method Phaser.QuadTree#populateHandler
        // * @param {Phaser.Sprite} sprite - The Sprite to check.
        // */
        // populateHandler = (sprite: ISprite) => {
        //   if (sprite.body && sprite.body.checkCollision.none === false && sprite.alive) {
        //     this.insert(sprite.body);
        //   }
        // }
        /*
        * Split the node into 4 subnodes
        *
        * @method Phaser.QuadTree#split
        */
        this.split = function () {
            _this.level++;
            //  top right node
            _this.nodes[0] = new RLGQuadTree(_this.bounds.right, _this.bounds.y, _this.bounds.subWidth, _this.bounds.subHeight, _this.maxObjects, _this.maxLevels, _this.level);
            //  top left node
            _this.nodes[1] = new RLGQuadTree(_this.bounds.x, _this.bounds.y, _this.bounds.subWidth, _this.bounds.subHeight, _this.maxObjects, _this.maxLevels, _this.level);
            //  bottom left node
            _this.nodes[2] = new RLGQuadTree(_this.bounds.x, _this.bounds.bottom, _this.bounds.subWidth, _this.bounds.subHeight, _this.maxObjects, _this.maxLevels, _this.level);
            //  bottom right node
            _this.nodes[3] = new RLGQuadTree(_this.bounds.right, _this.bounds.bottom, _this.bounds.subWidth, _this.bounds.subHeight, _this.maxObjects, _this.maxLevels, _this.level);
        };
        /*
        * Insert the object into the node. If the node exceeds the capacity, it will split and add all objects to their corresponding subnodes.
        *
        * @method Phaser.QuadTree#insert
        * @param {Phaser.Physics.Arcade.Body|object} body - The Body object to insert into the quadtree.
        */
        this.insert = function (shadowRoot) {
            var i = 0;
            var index;
            //  if we have subnodes ...
            if (_this.nodes[0] != null) {
                index = _this.getIndex(shadowRoot.bounds);
                if (index !== -1) {
                    _this.nodes[index].insert(shadowRoot);
                    return;
                }
            }
            _this.objects.push(shadowRoot);
            if (_this.objects.length > _this.maxObjects && _this.level < _this.maxLevels) {
                //  Split if we don't already have subnodes
                if (_this.nodes[0] == null) {
                    _this.split();
                }
                //  Add objects to subnodes
                while (i < _this.objects.length) {
                    index = _this.getIndex(_this.objects[i].bounds);
                    if (index !== -1) {
                        //  this is expensive - see what we can do about it
                        _this.nodes[index].insert(_this.objects.splice(i, 1)[0]);
                    }
                    else {
                        i++;
                    }
                }
            }
        };
        /*
        * Determine which node the object belongs to.
        *
        * @method Phaser.QuadTree#getIndex
        * @param {Phaser.Rectangle|object} rect - The bounds in which to check.
        * @return {number} index - Index of the subnode (0-3), or -1 if rect cannot completely fit within a subnode and is part of the parent node.
        */
        this.getIndex = function (rect) {
            //  default is that rect doesn't fit, i.e. it straddles the internal quadrants
            var index = -1;
            if (rect.x < _this.bounds.right && rect.right < _this.bounds.right) {
                if ((rect.y < _this.bounds.bottom && rect.bottom < _this.bounds.bottom)) {
                    //  rect fits within the top-left quadrant of this quadtree
                    index = 1;
                }
                else if ((rect.y > _this.bounds.bottom)) {
                    //  rect fits within the bottom-left quadrant of this quadtree
                    index = 2;
                }
            }
            else if (rect.x > _this.bounds.right) {
                //  rect can completely fit within the right quadrants
                if ((rect.y < _this.bounds.bottom && rect.bottom < _this.bounds.bottom)) {
                    //  rect fits within the top-right quadrant of this quadtree
                    index = 0;
                }
                else if ((rect.y > _this.bounds.bottom)) {
                    //  rect fits within the bottom-right quadrant of this quadtree
                    index = 3;
                }
            }
            return index;
        };
        /*
        * Return all objects that could collide with the given Sprite.
        *
        * @method Phaser.QuadTree#retrieve
        * @param {Phaser.Sprite} sprite - The sprite to check against.
        * @return {array} - Array with all detected objects.
        */
        this.retrieve = function (coreShadow) {
            var returnObjects = _this.objects;
            coreShadow.quadTreeIndex = _this.getIndex(coreShadow.bounds);
            //  Temp store for the node IDs this sprite is in, we can use this for fast elimination later
            // sprite.body.quadTreeIDs.push(this.ID);
            if (_this.nodes[0]) {
                //  if rect fits into a subnode ..
                if (coreShadow.quadTreeIndex !== -1) {
                    returnObjects = returnObjects.concat(_this.nodes[coreShadow.quadTreeIndex].retrieve(coreShadow));
                }
                else {
                    //  if rect does not fit into a subnode, check it against all subnodes (unrolled for speed)
                    returnObjects = returnObjects.concat(_this.nodes[0].retrieve(coreShadow));
                    returnObjects = returnObjects.concat(_this.nodes[1].retrieve(coreShadow));
                    returnObjects = returnObjects.concat(_this.nodes[2].retrieve(coreShadow));
                    returnObjects = returnObjects.concat(_this.nodes[3].retrieve(coreShadow));
                }
            }
            return returnObjects;
        };
        /*
        * Clear the quadtree.
        * @method Phaser.QuadTree#clear
        */
        this.clear = function () {
            _this.objects = [];
            for (var i = 0, len = _this.nodes.length; i < len; i++) {
                if (_this.nodes[i]) {
                    _this.nodes[i].clear();
                    delete _this.nodes[i];
                }
            }
        };
        this.maxObjects = maxObjects || 10;
        this.maxLevels = maxLevels || 4;
        this.level = level || 0;
        this.bounds = {
            x: Math.round(x),
            y: Math.round(y),
            width: width,
            height: height,
            subWidth: Math.floor(width / 2),
            subHeight: Math.floor(height / 2),
            right: Math.round(x) + Math.floor(width),
            bottom: Math.round(y) + Math.floor(height)
        };
        this.objects = [];
        this.nodes = [];
    }
    ;
    return RLGQuadTree;
}());
exports.default = RLGQuadTree;
//# sourceMappingURL=RLGQuadTree.js.map