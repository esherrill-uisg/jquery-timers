/// <reference types="jquery" />

interface JQueryStatic {
  timer: TimerPlugin;
}
interface JQuery {
  /**
   * Adds a timer the the HTMLElement
   * @param interval The interval like 5 as number or '5ms' as string.
   * @param label The label for the timer
   * @param fn the callback function wich has to be called.
   * @param times How many times this will be repeated befor it stops
   */
  everyTime (interval: number | string, label: string, fn: TimerPluginFunction, times?: number): JQuery;
  /**
   * Adds a timer the the HTMLElement with times=1
   * @param interval The interval like 5 as number or '5ms' as string.
   * @param label The label for the timer
   * @param fn the callback function wich has to be called.
   */
  oneTime (interval: number | string, label: string, fn: TimerPluginFunction): JQuery;
  /**
   * removes the timer from the HTMLElement
   *
   * @param label The label for the timer
   * @param fn the callback function wich has to be called.
   */
  stopTime (label: string, fn: TimerPluginFunction): JQuery;
  /**
   * Checks if a timer with this label exists on the Element
   * @param label
   */
  hasTime (label?: string): boolean;
}
/**
 * Options for the example plugin.
 */
interface TimerPluginOptions {
  global: Array<HTMLElement>,
  guid: number,
  dataKey: string,
  regex: RegExp,
  powers:
  {
    // Yeah this is major overkill...
    [key: string]: number
  }
}
interface TimerPluginFunction {
  (counter: number): boolean;
  timerID?: number;
}
/**
 * Declaration of the example plugin.
 */
interface TimerPlugin extends TimerPluginOptions {
  /**
   *
   * @param element
   * @param label The label for the timer
   * @param fn the callback function wich has to be called.
   */
  remove (element: HTMLElement, label?: string, fn?: TimerPluginFunction);
  /**
   *
   * @param interval The interval like 5 as number or '5ms' as string.
   */
  timeParse (interval: string | number): number | null;
  /**
   * Checks if a timer with this label exists on the Element
   * @param element
   * @param label The label for the timer
   */
  has (element: HTMLElement, label?: string): boolean;
  /**
   * Adds a timer the the given HTMLElement
   * @param element
   * @param interval The interval like 5 as number or '5ms' as string.
   * @param label The label for the timer
   * @param fn the callback function wich has to be called.
   * @param times How many times this will be repeated befor it stops
   */
  add (element: HTMLElement, interval: string | number, label: string, fn: TimerPluginFunction, times: number);
}


