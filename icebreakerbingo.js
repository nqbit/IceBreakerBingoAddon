// [START ice_breaker_bingo]
/*
  A quick tool to generate fun people bingo boards: a great ice breaker for any
  event.
*/

function onOpen(e) {
  DocumentApp.getUi().createAddonMenu()
      .addItem('Generate Board', 'showSidebar')
      .addToUi();
}

function onInstall(e) {
  onOpen(e);
}

function showSidebar() {
  var ui = HtmlService.createHtmlOutputFromFile('sidebar')
      .setTitle('People Bingo');
  DocumentApp.getUi().showSidebar(ui);
}

function beginGenerateBoard(board_config) {
  var doc = DocumentApp.getActiveDocument();
  var body = doc.getBody();

  body.clear();

  var tiles = board_config.tiles;
  var shuffled_tiles = [];

  // Shuffle tiles
  tiles = shuffleArray(tiles.slice());

  // Try and shuffle tiles and make sure no two are alike.
  for (var i = 0; i < board_config.board_count; i++) {

    // This is a rough attempt to set a limit as to the number of retries given
    // to finding a unique shuffled board.
    for (var j = 0; j < 20; j++) {
      if (shuffled_tiles.indexOf(tiles) == -1) break;

      tiles = shuffleArray(tiles.slice());
    }

    shuffled_tiles.push(tiles);
    createSinglePeopleBingoPage(
        board_config.title, board_config.free_space, tiles, board_config.rules);
  }
}

function createSinglePeopleBingoPage(
    board_title, board_free_spot, board_tiles, rules) {
  var doc = DocumentApp.getActiveDocument();
  var body = doc.getBody();

  // Create title
  par_title = body.appendParagraph(board_title);
  par_title.setHeading(DocumentApp.ParagraphHeading.TITLE);
  par_title.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  par_space = body.appendParagraph('');

  // Generate array of board tiles to convert into a table later.
  var cells = [];

  var current_board = 0;
  for (var i = 0; i < 5; i++) {
    var row = [];
    cells.push(row);
    for (var j = 0; j < 5; j++) {
      if (i == 2 && j == 2) {
        row.push(board_free_spot);
      } else {
        if (current_board < board_tiles.length) {
          row.push(board_tiles[current_board]);
        } else {
          row.push('Undefined');
        }
        current_board += 1;
      }
    }
  }

  // Create a table of tiles.
  table = body.appendTable(cells);

  // Format table.
  for (var i = 0; i < 5; i++) {
    row = table.getRow(i);
    row.setMinimumHeight(75);
    for (var j = 0; j < 5; j++) {
      cell = table.getCell(i, j);
      cell.setVerticalAlignment(DocumentApp.VerticalAlignment.CENTER);
      var par = cell.getChild(0).asParagraph();
      par.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
    }
  }

  // Create rules sections.
  par_rules = body.appendParagraph('Rules');
  par_rules.setHeading(DocumentApp.ParagraphHeading.HEADING1);

  for (var i = 0; i < rules.length; i++) {
    var listitem = body.appendListItem(rules[i]);
    listitem.setGlyphType(DocumentApp.GlyphType.BULLET);
  }

  // Start a new page.
  body.appendPageBreak();
}

function shuffleArray(array) {
  var i, j, temp;
  for (i = array.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

// [END ice_breaker_bingo]
