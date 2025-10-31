import $ from 'jquery';

export function applyBaseStyles() {
    $('body').css({
        'font-family': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        'background-color': '#f5f5f5',
        'margin': '0',
        'padding': '50px',
        'display': 'flex',
        'justify-content': 'center',
        'align-items': 'center',
        'min-height': '100vh'
    });

    $('.container').css({
        'text-align': 'center',
        'max-width': '800px'
    });

    $('h1').css({
        'font-size': '2.5rem',
        'color': '#2c3e50',
        'margin-bottom': '20px'
    });

    $('p').css({
        'font-size': '1.2rem',
        'color': '#7f8c8d'
    });
  $('button').css({
        'padding': '15px 40px',
        'font-size': '1.1rem',
        'font-weight': '600',
        'border': 'none',
        'border-radius': '50px',
        'cursor': 'pointer',
        'transition': 'all 0.3s ease',
        'box-shadow': '0 4px 15px rgba(0,0,0,0.2)',
        'min-width': '150px'
    });

    $('.btn-primary').css({
        'background': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'color': 'white'
    });

    $('.btn-secondary').css({
        'background': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'color': 'white'
    });
}