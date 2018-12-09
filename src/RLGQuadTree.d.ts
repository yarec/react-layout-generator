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
import { IRect } from './types';
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
export declare class Bounds implements IBounds {
    x: number;
    y: number;
    width: number;
    height: number;
    subWidth: number;
    subHeight: number;
    right: number;
    bottom: number;
    constructor(v: IRect);
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
    objects: IShadowRoot[];
    nodes: RLGQuadTree[];
    constructor(x: number, y: number, width: number, height: number, maxObjects?: number, maxLevels?: number, level?: number);
    populate: (group: IShadowRoot[]) => void;
    split: () => void;
    insert: (shadowRoot: IShadowRoot) => void;
    getIndex: (rect: IBounds) => number;
    retrieve: (coreShadow: IShadowRoot) => IShadowRoot[];
    clear: () => void;
}
