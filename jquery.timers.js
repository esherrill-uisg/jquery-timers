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

jQuery.fn.extend
(
  {
    everyTime: function(interval, label, fn, times)
    {
      return this.each(function()
      {
        jQuery.timer.add(this, interval, label, fn, times);
      });
    },
    oneTime: function(interval, label, fn)
    {
      return this.each(function()
      {
        jQuery.timer.add(this, interval, label, fn, 1);
      });
    },
    stopTime: function(label, fn)
    {
      return this.each(function()
      {
        jQuery.timer.remove(this, label, fn);
      });
    },
    hasTime: function(label)
    {
      for (var i = 0; i < jQuery(this).size(); i++)
      {
        if (jQuery.timer.has(jQuery(this).eq(i).get(0), label))
        {
          return true;
        }
      }
      
      return false;
    }
  }
);

jQuery.extend
(
  {
    timer:
    {
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
      timeParse: function(value)
      {
        if (value == undefined || value == null)
        {
          return null;
        }
        
        var result = this.regex.exec(jQuery.trim(value.toString()));
        if (result[2])
        {
          var num = parseFloat(result[1]);
          var mult = this.powers[result[2]] || 1;
          return num * mult;
        }
        else
        {
          return value;
        }
      },
      has: function(element, label)
      {
        var timers = jQuery.data(element, this.dataKey);
        
        if (!timers)
        {
          return false;
        }
        
        if (!label)
        {
          if (Object.keys(timers).length)
          {
            return true;
          }
          
          return false;
        }
        
        if (typeof timers[label] === 'undefined')
        {
          return false;
        }
        
        return true;
      },
      add: function(element, interval, label, fn, times)
      {
        var counter = 0;
        
        if (jQuery.isFunction(label))
        {
          if (!times) 
          {
            times = fn;
          }
          
          fn = label;
          label = interval;
        }
        
        interval = jQuery.timer.timeParse(interval);
  
        if (typeof interval != 'number' || isNaN(interval) || interval < 0)
        {
          return;
        }
  
        if (typeof times != 'number' || isNaN(times) || times < 0) 
        {
          times = 0;
        }
      
        
        times = times || 0;
        
        var timers = jQuery.data(element, this.dataKey) || jQuery.data(element, this.dataKey, {});
        
        if (!timers[label])
        {
          timers[label] = {};
        }
        
        fn.timerID = fn.timerID || this.guid++;
        
        var handler = function()
        {
          if ((++counter > times && times !== 0) || fn.call(element, counter) === false)
          {
            jQuery.timer.remove(element, label, fn);
          }
        };
        
        handler.timerID = fn.timerID;
        
        if (!timers[label][fn.timerID])
        {
          timers[label][fn.timerID] = window.setInterval(handler,interval);
        }
        
        this.global.push(element);
        
      },
      remove: function(element, label, fn)
      {
        var timers = jQuery.data(element, this.dataKey), ret;
        
        if (timers)
        {
          
          if (!label)
          {
            for (label in timers)
            {
              this.remove(element, label, fn);
            }
            
          }
          else if (timers[label])
          {
            if (fn)
            {
              if (fn.timerID)
              {
                window.clearInterval(timers[label][fn.timerID]);
                delete timers[label][fn.timerID];
              }
            }
            else
            {
              for (var fn in timers[label])
              {
                window.clearInterval(timers[label][fn]);
                delete timers[label][fn];
              }
            }
            
            for (ret in timers[label])
            {
              break;
            }
            
            if (!ret)
            {
              ret = null;
              delete timers[label];
            }
          }
          
          for (ret in timers)
          {
            break;
          }
          
          if (!ret)
          {
            jQuery.removeData(element, this.dataKey);
          }
        }
      }
    }
  }
);

jQuery(window).bind("unload", function()
{
  jQuery.each(jQuery.timer.global, function(index, item)
  {
    jQuery.timer.remove(item);
  });
});