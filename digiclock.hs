-- ========| IMPORTS     |========= --
import Time exposing (Time, second, millisecond, every)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.App as App

-- ========| MAIN     |========= --
main = app

-- ========| APP ARG     |========= --
arg =
  {  init = firstTuple
  ,  view = webpage
  ,  update = update
  ,  subscriptions = subsTicks
  }
-- ========| App     |========= --
app = 
  App.program arg
  
-- ========| INITIAL TUPLE     |========= --
firstTuple = 
  (model, Cmd.none)
  
-- ========| MODEL     |========= --
type alias Model = 
  {  hour:  Int
  ,  min:   Int
  ,  sec:   Time
  }
  
model = 
  Model 0 1 42
  
-- ========| VIEW     |========= --
webpage model= 
  Html.text 
    ("Digital Clock: "
    ++ toString(.min model)
    ++" : " 
    ++ toString(.sec model)
    )

-- ========| UPDATE     |========= --
type Handler = 
  Tick Time
update handler model = 
  case handler of
    Tick tock ->
      if
        model.sec >= 59
      then 
        let x = 0
        in ({model | sec = x, min = model.min + 1}, Cmd.none)
      else
        let x = model.sec +1
        in ({model | sec = x}, Cmd.none)

      

-- ========| SUBSCRIPTIONS     |========= --
subsTicks model =
  every second Tick
  
-- ========| DISPLAY     |========= --














