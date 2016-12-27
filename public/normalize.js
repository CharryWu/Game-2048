function initHandler(event)
{
  let $title = document.querySelector('.game-title');
  let $tab_title = document.querySelectorAll('.score-tab-title');
  let $score_num = document.querySelectorAll('.score-num');
  $title.style.lineHeight = window.getComputedStyle($title).height;
  let line_height = window.getComputedStyle($tab_title[0]).height;
  for (let index = 0; index < 2; index++)
  {
    $tab_title[index].style.lineHeight = line_height;
    $score_num[index].style.lineHeight = line_height;
  }

}
window.onload = initHandler;
window.onresize = initHandler;