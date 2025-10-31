import $ from 'jquery';

export function applyBaseStyles() {
    const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    $('body').css({
        'font-family': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        'background': isDark ? '#1a1a1a' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'min-height': '100vh',
        'display': 'flex',
        'justify-content': 'center',
        'align-items': 'center',
        'padding': '20px',
        'margin': '0',
        'overflow': 'hidden'
    });

    $('.container').css({
        'background': isDark ? '#2d2d2d' : 'white',
        'padding': '60px 40px',
        'border-radius': '20px',
        'box-shadow': isDark ? '0 20px 60px rgba(0,0,0,0.6)' : '0 20px 60px rgba(0,0,0,0.3)',
        'text-align': 'center',
        'max-width': '600px',
        'width': '100%'
    });

    $('h1').css({
        'font-size': '2.5rem',
        'color': isDark ? '#e0e0e0' : '#2c3e50',
        'margin-bottom': '15px',
        'font-weight': 'bold'
    });

    $('.subtitle').css({
        'font-size': '1.1rem',
        'color': isDark ? '#a0a0a0' : '#7f8c8d',
        'margin-bottom': '40px'
    });

    $('.button-group').css({
        'display': 'flex',
        'gap': '15px',
        'justify-content': 'center',
        'flex-wrap': 'wrap'
    });
}

export function applyButtonStyles() {
    $('button').css({
        'padding': '15px 35px',
        'font-size': '1rem',
        'font-weight': '600',
        'border': 'none',
        'border-radius': '10px',
        'cursor': 'pointer',
        'transition': 'all 0.3s ease',
        'box-shadow': '0 4px 15px rgba(0,0,0,0.2)'
    });

    $('.btn-primary').css({
        'background': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'color': 'white'
    });

    $('.btn-secondary').css({
        'background': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'color': 'white'
    });

    $('button').off('mouseenter mouseleave').hover(
        function() {
            $(this).css({
                'transform': 'translateY(-2px)',
                'box-shadow': '0 6px 20px rgba(0,0,0,0.3)'
            });
        },
        function() {
            $(this).css({
                'transform': 'translateY(0)',
                'box-shadow': '0 4px 15px rgba(0,0,0,0.2)'
            });
        }
    );
}