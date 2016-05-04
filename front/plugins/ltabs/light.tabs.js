(function($){
    jQuery.fn.lightTabs = function(options){
        var createTabs = function(){
            tabs = this;
            i = 0;

            showPage = function(i){
                $(tabs).children('div').children('div').removeClass('active');
                $(tabs).children('div').children('div').eq(i).addClass('active');
                $(tabs).children('ul').children('li').removeClass('active');
                $(tabs).children('ul').children('li').eq(i).addClass('active');
            };

            showPage($(tabs).children('ul').children('li.active').index());

            $(tabs).children('ul').children('li').each(function(index, element){
                $(element).attr('data-page', i);
                i++;
            });

            $(tabs).children('ul').children('li').click(function(){
                showPage(parseInt($(this).attr('data-page')));
            });
        };
        return this.each(createTabs);
    };
})(jQuery);