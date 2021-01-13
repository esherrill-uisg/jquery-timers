/**
 * jQuery.timers - Timer abstractions for jQuery
 * Originally written by Blair Mitchelmore (blair DOT mitchelmore AT gmail DOT com).
 * New features added by Arttu Manninen (arttu AT kaktus DOT cc).
 * Licensed under the WTFPL (http://sam.zoy.org/wtfpl/).
 * Date: 2013/02/11
 *
 * @author Blair Mitchelmore
 * @author Arttu Manninen
 * @version 1.3
 *
 **/
/// <reference path="./jquery.timers.d.ts"/>

(function ($) {
  $.fn.everyTime = function (interval: any, label: any, fn: any, times: any) {
    this.each(function () {
      jQuery.timer.add(this, interval, label, fn, times);
    });
    return this;
  };

  $.fn.oneTime = function (interval, label, fn) {
    return this.each(function () {
      jQuery.timer.add(this, interval, label, fn, 1);
    });
  };
  $.fn.stopTime = function (label, fn) {
    return this.each(function () {
      jQuery.timer.remove(this, label, fn);
    });
  }
  $.fn.hasTime = function (label) {
    for (var i = 0; i < $(this).length; i++) {
      if ($.timer.has($(this).eq(i).get(0), label)) {
        return true;
      }
    }

    return false;
  }

  $.timer = {
    global: [],
    guid: 1,
    dataKey: "jQuery.timer",
    regex: /^([0-9]+(?:\.[0-9]*)?)\s*(.*s)?$/,
    powers:
    {
      // Yeah this is major overkill...
      'ms': 1,
      'cs': 10,
      'ds': 100,
      's': 1000,
      'das': 10000,
      'hs': 100000,
      'ks': 1000000
    },
    timeParse: function (value) {
      if (value == undefined || value == null) {
        return null;
      }

      const result = this.regex.exec(jQuery.trim(value.toString()));
      if (result && result[2]) {
        var num = parseFloat(result[1]);
        var mult = this.powers[result[2]] || 1;
        return num * mult;
      }
      else {
        return +value;
      }
    },
    has: function (element, label) {
      var timers = jQuery.data(element, this.dataKey);

      if (!timers) {
        return false;
      }

      if (!label) {
        if (Object.keys(timers).length) {
          return true;
        }

        return false;
      }

      if (typeof timers[label] === 'undefined') {
        return false;
      }

      return true;
    },
    add: function (element, interval, label, fn, times) {
      let counter = 0;

      const val = this.timeParse(interval);

      if (val == null || typeof val != 'number' || isNaN(val) || val < 0) {
        return;
      }

      if (typeof times != 'number' || isNaN(times) || times < 0) {
        times = 0;
      }


      times = times || 0;

      const timers = jQuery.data(element, this.dataKey) || jQuery.data(element, this.dataKey, {});

      if (!timers[label]) {
        timers[label] = {};
      }

      (fn as TimerPluginFunction).timerID = (fn as TimerPluginFunction).timerID || this.guid++;

      const handler = function () {
        if ((++counter > times && times !== 0) || (fn as TimerPluginFunction).call(element, counter) === false) {
          jQuery.timer.remove(element, label, fn);
        }
      };

      handler.timerID = (fn as TimerPluginFunction).timerID;
      const id = (fn as TimerPluginFunction).timerID;
      if (id && !timers[label][id]) {
        timers[label][id] = setInterval(handler, val);
      }

      this.global.push(element);

    },
    remove: function (element, label, fn) {
      const timers = jQuery.data(element, this.dataKey);
      let ret;

      if (timers) {

        if (!label) {
          for (label in timers) {
            this.remove(element, label, fn);
          }

        }
        else if (timers[label]) {
          if (fn) {
            if (fn.timerID) {
              clearInterval(timers[label][fn.timerID]);
              delete timers[label][fn.timerID];
            }
          }
          else {
            for (let fn in timers[label]) {
              clearInterval(timers[label][fn]);
              delete timers[label][fn];
            }
          }

          for (ret in timers[label]) {
            break;
          }

          if (!ret) {
            ret = null;
            delete timers[label];
          }
        }

        for (ret in timers) {
          break;
        }

        if (!ret) {
          jQuery.removeData(element, this.dataKey);
        }
      }
    }

  };

  jQuery(window).on("unload", function () {
    jQuery.each(jQuery.timer.global, function (index, item) {
      jQuery.timer.remove(item);
    });
  });
})(jQuery);
