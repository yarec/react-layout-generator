/**
 * Converted to typescript for react-layout-generator
 * See https://photonstorm.github.io/phaser-ce/Phaser.QuadTree.html
 */

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Javascript QuadTree 
* @version 1.0
* @author Timo Hausmann
*
* @version 1.2, September 4th 2013
* @author Richard Davey
* The original code was a conversion of the Java code posted to GameDevTuts. However I've tweaked
* it massively to add node indexing, removed lots of temp. var creation and significantly
* increased performance as a result.
*
* Original version at https://github.com/timohausmann/quadtree-js/
*/

/**
* @copyright © 2012 Timo Hausmann
*
* Permission is hereby granted, free of charge, to any person obtaining
* a copy of this software and associated documentation files (the
* "Software"), to deal in the Software without restriction, including
* without limitation the rights to use, copy, modify, merge, publish,
* distribute, sublicense, and/or sell copies of the Software, and to
* permit persons to whom the Software is furnished to do so, subject to
* the following conditions:
*
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
* MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
* LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
* OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
* WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

// import {Rect} from './types';

export interface IBounds {
  x: number;
  y: number;
  width: number;
  height: number;
  subWidth: number;
  subHeight: number;
  right: number;
  bottom: number;
}

export interface IShadowRoot {
  bounds: IBounds;
  quadTreeIndex: number;
}

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
export default class RLGQuadTree {
  maxObjects: number;
  maxLevels: number;
  level: number;
  bounds: IBounds;
  objects: Array<IShadowRoot>;
  nodes: Array<RLGQuadTree>;

  constructor(x: number, y: number, width: number, height: number, maxObjects?: number, maxLevels?: number, level?: number) {

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
      right: Math.round(x) + Math.floor(width / 2),
      bottom: Math.round(y) + Math.floor(height / 2)
    };

    this.objects = [];
    this.nodes = [];

  };


  /*
  * Populates this quadtree with the members of the given Group.
  * 
  * @method Phaser.QuadTree#populate
  * @param {Phaser.Group} group - The Group to add to the quadtree.
  */
  populate = (group: Array<IShadowRoot>) => {

    group.forEach((item: IShadowRoot) => this.insert(item));

  }

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
  split = () => {

    this.level++;

    //  top right node
    this.nodes[0] = new RLGQuadTree(this.bounds.right, this.bounds.y, this.bounds.subWidth, this.bounds.subHeight, this.maxObjects, this.maxLevels, this.level);

    //  top left node
    this.nodes[1] = new RLGQuadTree(this.bounds.x, this.bounds.y, this.bounds.subWidth, this.bounds.subHeight, this.maxObjects, this.maxLevels, this.level);

    //  bottom left node
    this.nodes[2] = new RLGQuadTree(this.bounds.x, this.bounds.bottom, this.bounds.subWidth, this.bounds.subHeight, this.maxObjects, this.maxLevels, this.level);

    //  bottom right node
    this.nodes[3] = new RLGQuadTree(this.bounds.right, this.bounds.bottom, this.bounds.subWidth, this.bounds.subHeight, this.maxObjects, this.maxLevels, this.level);

  }

  /*
  * Insert the object into the node. If the node exceeds the capacity, it will split and add all objects to their corresponding subnodes.
  * 
  * @method Phaser.QuadTree#insert
  * @param {Phaser.Physics.Arcade.Body|object} body - The Body object to insert into the quadtree.
  */
  insert = (shadowRoot: IShadowRoot) => {

    var i = 0;
    var index;

    //  if we have subnodes ...
    if (this.nodes[0] != null) {
      index = this.getIndex(shadowRoot.bounds);

      if (index !== -1) {
        this.nodes[index].insert(shadowRoot);
        return;
      }
    }

    this.objects.push(shadowRoot);

    if (this.objects.length > this.maxObjects && this.level < this.maxLevels) {
      //  Split if we don't already have subnodes
      if (this.nodes[0] == null) {
        this.split();
      }

      //  Add objects to subnodes
      while (i < this.objects.length) {
        index = this.getIndex(this.objects[i].bounds);

        if (index !== -1) {
          //  this is expensive - see what we can do about it
          this.nodes[index].insert(this.objects.splice(i, 1)[0]);
        }
        else {
          i++;
        }
      }
    }

  }

  /*
  * Determine which node the object belongs to.
  * 
  * @method Phaser.QuadTree#getIndex
  * @param {Phaser.Rectangle|object} rect - The bounds in which to check.
  * @return {number} index - Index of the subnode (0-3), or -1 if rect cannot completely fit within a subnode and is part of the parent node.
  */
  getIndex = (rect: IBounds) => {

    //  default is that rect doesn't fit, i.e. it straddles the internal quadrants
    var index = -1;

    if (rect.x < this.bounds.right && rect.right < this.bounds.right) {
      if ((rect.y < this.bounds.bottom && rect.bottom < this.bounds.bottom)) {
        //  rect fits within the top-left quadrant of this quadtree
        index = 1;
      }
      else if ((rect.y > this.bounds.bottom)) {
        //  rect fits within the bottom-left quadrant of this quadtree
        index = 2;
      }
    }
    else if (rect.x > this.bounds.right) {
      //  rect can completely fit within the right quadrants
      if ((rect.y < this.bounds.bottom && rect.bottom < this.bounds.bottom)) {
        //  rect fits within the top-right quadrant of this quadtree
        index = 0;
      }
      else if ((rect.y > this.bounds.bottom)) {
        //  rect fits within the bottom-right quadrant of this quadtree
        index = 3;
      }
    }

    return index;

  }

  /*
  * Return all objects that could collide with the given Sprite.
  * 
  * @method Phaser.QuadTree#retrieve
  * @param {Phaser.Sprite} sprite - The sprite to check against.
  * @return {array} - Array with all detected objects.
  */
  retrieve = (coreShadow: IShadowRoot) => {

    var returnObjects = this.objects;

    coreShadow.quadTreeIndex = this.getIndex(coreShadow.bounds);

    //  Temp store for the node IDs this sprite is in, we can use this for fast elimination later
    // sprite.body.quadTreeIDs.push(this.ID);

    if (this.nodes[0]) {
      //  if rect fits into a subnode ..
      if (coreShadow.quadTreeIndex !== -1) {
        returnObjects = returnObjects.concat(this.nodes[coreShadow.quadTreeIndex].retrieve(coreShadow));
      }
      else {
        //  if rect does not fit into a subnode, check it against all subnodes (unrolled for speed)
        returnObjects = returnObjects.concat(this.nodes[0].retrieve(coreShadow));
        returnObjects = returnObjects.concat(this.nodes[1].retrieve(coreShadow));
        returnObjects = returnObjects.concat(this.nodes[2].retrieve(coreShadow));
        returnObjects = returnObjects.concat(this.nodes[3].retrieve(coreShadow));
      }
    }

    return returnObjects;

  }

  /*
  * Clear the quadtree.
  * @method Phaser.QuadTree#clear
  */
  clear = () => {

    this.objects = [];

    for (var i = 0, len = this.nodes.length; i < len; i++) {
      if (this.nodes[i]) {
        this.nodes[i].clear();
        delete this.nodes[i];
      }
    }
  }
}


