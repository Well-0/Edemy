import $ from 'jquery';
import * as path from 'path';
import { applyBaseStyles } from './ts/styles';

$(() => {
    applyBaseStyles();

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
        console.log('Loading Home Page');
  
       window.location.href = 'html/home.html';
});

    $('.btn-secondary').on('click', () => {
        console.log('Browse Lessons clicked');
        alert('Browse Lessons button clicked!');
    });

});