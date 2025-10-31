import $ from 'jquery';

$(() => {
    // Body styles
    $('body').css({
        'font-family': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        'background': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'min-height': '100vh',
        'display': 'flex',
        'justify-content': 'center',
        'align-items': 'center',
        'padding': '20px',
        'margin': '0'
    });

    // Container styles
    $('.container').css({
        'background': 'white',
        'padding': '60px 40px',
        'border-radius': '20px',
        'box-shadow': '0 20px 60px rgba(0,0,0,0.3)',
        'text-align': 'center',
        'max-width': '600px',
        'width': '100%'
    });

    // Heading styles
    $('h1').css({
        'font-size': '2.5rem',
        'color': '#2c3e50',
        'margin-bottom': '15px',
        'font-weight': 'bold'
    });

    $('.subtitle').css({
        'font-size': '1.1rem',
        'color': '#7f8c8d',
        'margin-bottom': '40px'
    });

    // Button group
    $('.button-group').css({
        'display': 'flex',
        'gap': '15px',
        'justify-content': 'center',
        'flex-wrap': 'wrap'
    });

    // Button base styles
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

    // Primary button
    $('.btn-primary').css({
        'background': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'color': 'white'
    });

    // Secondary button
    $('.btn-secondary').css({
        'background': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'color': 'white'
    });

    // Hover effects
    $('button').hover(
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

    // Click handlers
    $('.btn-primary').on('click', () => {
        console.log('Get Started clicked');
        alert('Get Started button clicked!');
    });

    $('.btn-secondary').on('click', () => {
        console.log('Browse Lessons clicked');
        alert('Browse Lessons button clicked!');
    });
});