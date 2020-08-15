
var player  = 0, prevt_turn=0;
var char_at = [ 'O', 'X' ];
var matrix  = [ [ "-","-","-" ], [ "-","-","-" ], [ "-","-","-" ] ];
var winner  = "-";
var scores  = [ 0, 0, 0 ];
var active_color = "#FFF", inactive_color="#888";
var path    = "";
var multi   = false;

$(document).ready( function()
{
  document.getElementById( "label-player-"+(player+1) ).style.color = active_color;
  document.getElementById( "label-player-"+((player+1)%2+1) ).style.color = inactive_color;

  document.getElementsByClassName('moving-border').width = window.getComputedStyle( document.getElementById("x-players") ).style.getPropertyValue("width");
});

function btn_click( x, y )
{
  if( document.getElementById( ""+x+","+y ).innerHTML == "" )
  {
    matrix[x][y] = char_at[player];

    document.getElementById( ""+x+","+y ).innerHTML = char_at[player];
    player = (player+1)%2;

    document.getElementById( "label-player-"+(player+1) ).style.color = active_color;
    document.getElementById( "label-player-"+((player+1)%2+1) ).style.color = inactive_color;

    winner = check_matrix( matrix );
    if( winner==char_at[0] )scores[0]++;
    else if( winner==char_at[1] )scores[2]++;
    else if( winner=="*" )scores[1]++;

    if( winner!="-" )
    {
      refresh_board();
      return ;
    }

    if( multi==false && player==1 )
      setTimeout( random_play, 500 );
  }
}

function random_play( )
{
  var bool = false, row, col;

  while( !bool )
  {
    row = parseInt( Math.random()*100 )%3;
    col = parseInt( Math.random()*100 )%3;

    console.log( " row "+row+" col : "+col+" mat : "+matrix[row][col] );

    if( matrix[row][col] != "-" )
      continue;

    break;
  }
  btn_click( row, col );
}

function refresh_board()
{
  document.getElementById("player-1").innerHTML = scores[0];
  document.getElementById("ties").innerHTML     = scores[1];
  document.getElementById("player-2").innerHTML = scores[2];

  prev_turn = ( prevt_turn+1 )%2;
  player = prev_turn;

  document.getElementById( "label-player-"+(player+1) ).style.color = active_color;
  document.getElementById( "label-player-"+((player+1)%2+1) ).style.color = inactive_color;

  var res=path.split("-");
  for( var i=0, a=0, b=0; i<3; i++, a++, b++ )
  {
    if( res[0]=="row" )
      a = parseInt( res[1] );
    else if( res[0]=="col" )
      b = parseInt( res[1] );
    else if( res[0]=="dig" && res[1]=="1" )
      b = 2-i;
    else
      break;

    document.getElementById( ""+a+","+b ).classList.add( "blink" );
  }

  setTimeout( function()
  {
    for( var i=0; i<3; i++ )
      for( var j=0; j<3; j++ )
      {
        document.getElementById(""+i+","+j).innerHTML = "";
        matrix[i][j]="-";
      }
    for( var i=0, a=0, b=0; i<3; i++, a++, b++ )
    {
      if( res[0]=="row" )
        a = parseInt( res[1] );
      else if( res[0]=="col" )
        b = parseInt( res[1] );
      else if( res[0]=="dig" && res[1]=="1" )
        b = 2-i;
      else
        break;

      document.getElementById( ""+a+","+b ).classList.remove( "blink" );
    }

    path = "";

    if( multi==false && player==1 )
      setTimeout( random_play, 1);

  }, 1000 );
}

function x_players()
{
  document.getElementById("player-1").innerHTML = 0;
  document.getElementById("ties").innerHTML     = 0;
  document.getElementById("player-2").innerHTML = 0;

  multi = !multi;

  if( multi==true )
  {
    document.getElementById("x-players").innerHTML = "single-player";
    document.getElementById("spam-player-1").innerHTML = "player 1";
    document.getElementById("spam-player-2").innerHTML = "player 2";
  }
  else
  {
    document.getElementById("x-players").innerHTML = "multi-player";
    document.getElementById("spam-player-1").innerHTML = "you";
    document.getElementById("spam-player-2").innerHTML = "me";
  }

  reset();
}

function reset()
{
  for( var i=0; i<3; i++ )
    for( var j=0; j<3; j++ )
    {
      document.getElementById(""+i+","+j).innerHTML = "";
      matrix[i][j]="-";
    }

  scores[0]=0;
  scores[1]=0;

  player = 0;
  document.getElementById( "label-player-"+(player+1) ).style.color = active_color;
  document.getElementById( "label-player-"+((player+1)%2+1) ).style.color = inactive_color;
}

function check_matrix( matrix )
{
  var row_sum="", col_sum="", right_diag_sum="", left_diag_sum="", bool=0;
  var winner = "-";

  for( var i=0; i<3; i++ )
  {
    row_sum="";
    col_sum="";

    for( var j=0; j<3; j++ )
    {
      row_sum+=matrix[i][j];
      col_sum+=matrix[j][i];

      if( matrix[i][j]=="-" )
        bool = 1;
    }

    if( col_sum=="OOO" || row_sum=="OOO" )
      winner = char_at[0];
    else if( col_sum=="XXX" || row_sum=="XXX" )
      winner = char_at[1];

    if( winner!="-" )
    {
      if( row_sum=="OOO" || row_sum=="XXX" )
        path = "row-"+i;
      if( col_sum=="OOO" || col_sum=="XXX" )
        path = "col-"+i;
    }
  }

  right_diag_sum = ( matrix[0][0]+matrix[1][1]+matrix[2][2] );
  left_diag_sum  = ( matrix[0][2]+matrix[1][1]+matrix[2][0] );

  if( right_diag_sum=="OOO" || left_diag_sum=="OOO" )
    winner = char_at[0];
  else if( right_diag_sum=="XXX" || left_diag_sum=="XXX" )
    winner = char_at[1];

  if( bool==0 && winner=="-" )
    winner = "*";

  if( winner!="-" && winner!="*" )
  {
    if( right_diag_sum=="OOO" || right_diag_sum=="XXX" )
      path = "dig-0";
    if( left_diag_sum=="OOO" || left_diag_sum=="XXX" )
      path = "dig-1";
  }

  return winner;
}
