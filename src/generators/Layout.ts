import {Rect} from '../types';
import {IGenerator} from './generator';

export interface ILayout {
  name: string;
  location: Rect; 
  editSize?: Array<IEdit>;
  g?: IGenerator;
}