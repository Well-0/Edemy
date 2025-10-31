import $ from 'jquery';
import * as path from 'path';
import { applyBaseStyles, applyButtonStyles } from './ts/styles';

function applyTheme() {
    console.log('Applying theme');
    applyBaseStyles();
    applyButtonStyles();
    console.log('Theme applied');
}

$(() => {
    applyTheme();
    
    // Listen for theme changes
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);
    }

    $('.btn-primary').on('click', () => {
        console.log('Loading Home Page');
        window.location.href = 'html/home.html';
    });

    $('.btn-secondary').on('click', () => {
        console.log('Browse Lessons clicked');
        alert('Browse Lessons button clicked!');
    });
});