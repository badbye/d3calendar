#' Calendar Heatmap
#'
#' Plot a calendar heatmap base on D3.
#'
#' @import htmlwidgets
#' @import jsonlite
#' @param df A data.frame object, which should has at least two columns: "date" and "value".
#' @example {
#' df = data.frame(date=as.Date('2018-01-01') + 0:364, value=rnorm(365))
#' df$label = sprintf('%s: %.2f%%', df$date, df$value * 100)
#' d3calendar(df)
#' }
#'
#' @export
d3calendar <- function(df, width = NULL, height = NULL,
                       elementId = NULL, settings = list(n_colors=11)
                       ) {
  stopifnot(is.data.frame(df))
  stopifnot('date' %in% colnames(df))
  stopifnot('value' %in% colnames(df))
  if (!('label' %in% colnames(df))) {
    df$label = sprintf('%s: %3s', df$date, df$value)
  }
  # stopifnot(colnames(df) == c('date', 'value', 'label'))
  if (class(df$date) != 'Date'){
    df$date = as.Date(as.character(df$date))
  }
  settings$min_year = as.integer(format(min(df$date), '%Y'))
  settings$max_year = as.integer(format(max(df$date), '%Y')) + 1
  settings$min_value = min(df$value)
  settings$max_value = max(df$value)
  df$date = format(df$date, '%Y-%m-%d')

  x = list(
    data = jsonlite::toJSON(lapply(split(df[, c('value', 'label')], df$date), as.list), auto_unbox=T),
    settings = settings
  )

  # create widget
  htmlwidgets::createWidget(
    name = 'd3calendar',
    x,
    width = width,
    height = height,
    package = 'd3calendar',
    elementId = elementId
  )
}

#' Shiny bindings for d3calendar
#'
#' Output and render functions for using d3calendar within Shiny
#' applications and interactive Rmd documents.
#'
#' @param outputId output variable to read from
#' @param width,height Must be a valid CSS unit (like \code{'100\%'},
#'   \code{'400px'}, \code{'auto'}) or a number, which will be coerced to a
#'   string and have \code{'px'} appended.
#' @param expr An expression that generates a d3calendar
#' @param env The environment in which to evaluate \code{expr}.
#' @param quoted Is \code{expr} a quoted expression (with \code{quote()})? This
#'   is useful if you want to save an expression in a variable.
#'
#' @name d3calendar-shiny
#'
#' @export
d3calendarOutput <- function(outputId, width = '100%', height = '400px'){
  htmlwidgets::shinyWidgetOutput(outputId, 'd3calendar', width, height, package = 'd3calendar')
}

#' @rdname d3calendar-shiny
#' @export
renderD3calendar <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) } # force quoted
  htmlwidgets::shinyRenderWidget(expr, d3calendarOutput, env, quoted = TRUE)
}
