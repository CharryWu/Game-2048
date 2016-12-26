/**
 * Created by charry on 16-12-25.
 */
let $title = document.querySelector('.game-title');
let $tab_title = document.querySelectorAll('.score-tab-title');
let $score_num = document.querySelectorAll('.score-num');
let $score_tab=document.querySelector('.score-tab');
function initHandler(event)
{
  $title.style.lineHeight = window.getComputedStyle($title).height;
  let tab_height_half = window.getComputedStyle($score_tab).height/2;
  for (let index = 0; index < 2; index++)
  {
    $tab_title[index].style.lineHeight = tab_height_half;
    $score_num[index].style.lineHeight = tab_height_half;
  }

}
window.onload = initHandler;
window.onresize = initHandler;