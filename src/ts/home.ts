import $ from 'jquery';
import { applyBaseStyles } from './styles';

$(() => {
    console.log('Home page script loaded and DOM ready');
    applyBaseStyles();
    console.log('Base styles applied to home page');
});