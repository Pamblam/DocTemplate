/* Plugins, etc, are on top. */

String.prototype.toInt = function()
{
  return parseInt(this);
};

/** {{{
* jQuery.ScrollTo - Easy element scrolling using jQuery.
* Copyright (c) 2007-2013 Ariel Flesler - aflesler<a>gmail<d>com | http://flesler.blogspot.com
* Dual licensed under MIT and GPL.
* @author Ariel Flesler
* @version 1.4.6
*/
(function($){var h=$.scrollTo=function(a,b,c){$(window).scrollTo(a,b,c)};h.defaults={axis:'xy',duration:parseFloat($.fn.jquery)>=1.3?0:1,limit:true};h.window=function(a){return $(window)._scrollable()};$.fn._scrollable=function(){return this.map(function(){var a=this,isWin=!a.nodeName||$.inArray(a.nodeName.toLowerCase(),['iframe','#document','html','body'])!=-1;if(!isWin)return a;var b=(a.contentWindow||a).document||a.ownerDocument||a;return/webkit/i.test(navigator.userAgent)||b.compatMode=='BackCompat'?b.body:b.documentElement})};$.fn.scrollTo=function(e,f,g){if(typeof f=='object'){g=f;f=0}if(typeof g=='function')g={onAfter:g};if(e=='max')e=9e9;g=$.extend({},h.defaults,g);f=f||g.duration;g.queue=g.queue&&g.axis.length>1;if(g.queue)f/=2;g.offset=both(g.offset);g.over=both(g.over);return this._scrollable().each(function(){if(e==null)return;var d=this,$elem=$(d),targ=e,toff,attr={},win=$elem.is('html,body');switch(typeof targ){case'number':case'string':if(/^([+-]=?)?\d+(\.\d+)?(px|%)?$/.test(targ)){targ=both(targ);break}targ=$(targ,this);if(!targ.length)return;case'object':if(targ.is||targ.style)toff=(targ=$(targ)).offset()}$.each(g.axis.split(''),function(i,a){var b=a=='x'?'Left':'Top',pos=b.toLowerCase(),key='scroll'+b,old=d[key],max=h.max(d,a);if(toff){attr[key]=toff[pos]+(win?0:old-$elem.offset()[pos]);if(g.margin){attr[key]-=parseInt(targ.css('margin'+b))||0;attr[key]-=parseInt(targ.css('border'+b+'Width'))||0}attr[key]+=g.offset[pos]||0;if(g.over[pos])attr[key]+=targ[a=='x'?'width':'height']()*g.over[pos]}else{var c=targ[pos];attr[key]=c.slice&&c.slice(-1)=='%'?parseFloat(c)/100*max:c}if(g.limit&&/^\d+$/.test(attr[key]))attr[key]=attr[key]<=0?0:Math.min(attr[key],max);if(!i&&g.queue){if(old!=attr[key])animate(g.onAfterFirst);delete attr[key]}});animate(g.onAfter);function animate(a){$elem.animate(attr,f,g.easing,a&&function(){a.call(this,targ,g)})}}).end()};h.max=function(a,b){var c=b=='x'?'Width':'Height',scroll='scroll'+c;if(!$(a).is('html,body'))return a[scroll]-$(a)[c.toLowerCase()]();var d='client'+c,html=a.ownerDocument.documentElement,body=a.ownerDocument.body;return Math.max(html[scroll],body[scroll])-Math.min(html[d],body[d])};function both(a){return typeof a=='object'?a:{top:a,left:a}}})(jQuery);
/*}}}*/


var PHP_NET = {};

PHP_NET.HEADER_HEIGHT = 52;

/**
 * Scrolls the page so that the given element will be shown into view.
 * 
 * @param HTMLElement element The element to show.
 * @param Number animationDuration Animation duration in milliseconds. Defaults to 400ms.
 * @param Function callback Function to execute after the animation is complete.
 * @return void
 */
PHP_NET.scrollElementIntoView = function(element, animationDuration, callback){
    animationDuration = animationDuration || 400;
    var destTop = $(element).offset().top - PHP_NET.HEADER_HEIGHT;
    var callbackCalled = false;
    $('html, body').animate(
        {scrollTop: destTop}, 
        animationDuration,
        function(){
            // prevents the callback to be called twice. temporary
            // solution until further investigation is done
            if(!callbackCalled) callback();
            callbackCalled = true;
        }
    );
};

/**
 * Enables "smooth scrolling to page anchor" for page <a> links.
 */
$(document).ready(function(){    
    $('a[href*=#]').click(function(e){
        var urlTester = document.createElement("a");
        urlTester.href = this.href;
        urlTester.hash = location.hash;
        var targetElement = document.getElementById(this.hash.substr(1));
        // this <a> targets an id="" on this very page
        // (the current URL and the target URL
        // are identic not considering their #hash fragments)
        if(urlTester.href == location.href && targetElement){
            // temporarily disable the id="" attribute from such element
            // so that UA's default scrolling is prevented
            var wasID = targetElement.id;
            targetElement.id = "";
            PHP_NET.scrollElementIntoView(targetElement, null, function(){
                // restore the id="" attribute to the element
                targetElement.id = wasID;
            });
        }
    });
});

/**
 * Enables "smooth scrolling to page anchor" when page was just loaded.
 */
$(document).ready(function(){
    var targetElm = location.hash ? document.getElementById(location.hash.substr(1)) : null;
    // if the location.hash points to an element that is actually in the document
    if(targetElm){
        // temporarily disable the id="" attribute from such element so that UA's default scrolling is prevented
        var wasID = targetElm.id;
        targetElm.id = "";
        // so when page is fully loaded and after some delay for a smoother result
        $(window).load(function(){
            setTimeout(function(){
                // animate the scrolling so that the element is shown into viewport
                PHP_NET.scrollElementIntoView(targetElm, null, function(){
                    // finally restore the id="" attribute to the element
                    targetElm.id = wasID;
                });
            }, 300);
        });
    }
});

$.expr[":"].icontains = $.expr.createPseudo(function(arg) {
    return function( elem ) {
        return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
    };
});
if (!('contains' in String.prototype)) {
    String.prototype.contains = function(str, startIndex) {
        return -1 !== String.prototype.indexOf.call(this, str, startIndex);
    };
}

$(document).ready(function() {
    var $docs = $('.docs');
    var $refsect1 = $docs.find('.refentry .refsect1');
    var $docsDivWithId = $docs.find('div[id]');
    $docsDivWithId.children("h1, h2, h3, h4").each(function(){
        $(this).append("<a class='genanchor' href='#" + $(this).parent().attr("id") + "'> ¶</a>");
    });
    
    $('.refentry code.parameter').click(function(event)
    {
      var id = $(this).text().replace(/^[&$]{0,2}/g, '');
      var offsetTop = $(
        '.parameters .parameter:contains("' + id + '"), .options .parameter:contains("' + id + '")'
      ).offset().top - 52;
      $.scrollTo({top: offsetTop, left: 0}, 400);
    });

    $('h1[id], h2[id], h3[id], h4[id]').each(function() {
        var $this = $(this);
        $this.append("<a class='genanchor' href='#" + $this.attr('id') + "'> ¶</a>");
    });

/*{{{ Scroll to top */
    (function() {

      var settings = {
        text: 'To Top',
        min: 200,
        inDelay: 600,
        outDelay: 400,
        containerID: 'toTop',
        containerHoverID: 'toTopHover',
        scrollSpeed: 400,
        easingType: 'linear'
      };
      
      var toTopHidden = true;
      var toTop = $('#' + settings.containerID);
      
      toTop.click(function(e) {
        e.preventDefault();
        $.scrollTo(0, settings.scrollSpeed, {easing: settings.easingType});
      });
      
      $(window).scroll(function() {
        var sd = $(this).scrollTop();
        if (sd > settings.min && toTopHidden)
        {
          toTop.fadeIn(settings.inDelay);
          toTopHidden = false;
        }
        else if(sd <= settings.min && ! toTopHidden)
        {
          toTop.fadeOut(settings.outDelay);
          toTopHidden = true;
        }
      });   

    })();
/*}}}*/

/* {{{ Remove "inline code" style from .parameter */
  // CSS3 can't traverse up the DOM tree
  $('code.parameter').closest('em').addClass('reset');
/* }}} */

/* {{{ Init template generated flash messages */
  $('#flash-message .message').each(function()
  {
 	  flashMessage($(this));
  });
/* }}} */

});

/* {{{ add-user.php animations */
$(function() {

  if ( ! document.getElementById('add-note-usernotes')) {
    return;
  }
  
  $('#usernotes').animate({marginLeft: 0}, 1000);
  
  $('#usernotes .note').removeAttr('style');
    
  var times = [3, 7, 10];
  for (i in times) {
    times[i] = times[i] * 1000;
  }
  
  var notes = [];
  notes[0] = $('#usernotes .bad');
  notes[1] = $('#usernotes .good');
  notes[2] = $('#usernotes .spam');

  setTimeout(function()
  {
    notes[0].find('.usernotes-voted').css('border-top-color', '#001155');
    notes[1].find('.usernotes-voteu').css('border-bottom-color', '#001155');
    
    var t = 1000;
    var i = 1;
    var timer = setInterval(function()
    {
      if (i * t > times[1] - times[0])
      {
        clearTimeout(timer);
        return;
      }
      
      notes[0].find('.tally').html( notes[0].find('.tally').html().toInt() - 1);
      notes[1].find('.tally').html( notes[1].find('.tally').html().toInt() + 1);
      
      i++;
    }, t);
    
    notes[0].find('.text').animate({opacity: 0.3}, (times[1] - times[0]));
    
  }, times[0]);
  
  setTimeout(function()
  {
    notes[2].find('.text').html("@BJORI DOESN'T LIKE SPAM").css('background-color', '#F9ECF2');
  }, times[1]);
  
  setTimeout(function()
  {
    notes[0].fadeOut();
    notes[2].fadeOut();
    $('#usernotes .count').html('1 note');
  }, times[2]);

});
/* }}} */

/* {{{ Flash Messenger */
function flashMessage(o)
{
  var defaults = { 
    timeout: 6000,
    type: 'success',
    text: '',
    parent: '#flash-message'
  };
  
  // Options are passed, set defaults and generate message
  if ( ! o.jquery)
  {
    var options = $.extend(defaults, o); 
  
    var id = 'id_' + Math.random().toString().replace('0.', '');

    var message = $('<div>')
                  .addClass('message ' + options.type)
                  .data('type', options.type)
                  .attr('id', id)
                  .html(options.text);

    $(options.parent).append(message);
    
    var o = $('#' + id);
  }
  // jQuery object is passed, that means the message is pre-generated
  // Only timeout is adjustable via data-timeout=""
  else
  {
    options = {timeout: o.data('timeout')};
  }

  var remove = function(o) {
    o.slideUp(400, function() {
      $(this).remove();
    });
  };

  if (options.timeout)
  {
    setTimeout(function()
    {
      if ( ! o.length)  {
        return;
      }
      remove(o);
    }, options.timeout);
  }
  
  o.on('click', function() {
    remove($(this));
  });
  
  return true;
}
/* }}} */
