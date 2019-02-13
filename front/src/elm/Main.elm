port module Main exposing (createSocket, gameCreated)

import Array exposing (Array)
import Browser
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Json.Decode
import Json.Decode.Pipeline as PipelineDecoder
import List


type Colour
    = Bu
    | Y
    | R
    | Ba
    | W


type alias Tile =
    { index : Int
    , colour : Colour
    }


type alias PatternSpot =
    { index : Int
    , colour : Maybe Colour
    }


type alias PatternLine =
    Array PatternSpot


type alias PatternLines =
    Array PatternLine


type alias Factory =
    { id : Int
    , tiles : Array Tile
    }


type alias Game =
    { factories : Array Factory
    , patternLines : PatternLines
    }


type alias Model =
    { game : Maybe Game
    }


type Msg
    = JoinGame
    | NewGame (Result Json.Decode.Error Game)


init : () -> ( Model, Cmd Msg )
init =
    \_ -> ( { game = Nothing }, Cmd.none )


port createSocket : () -> Cmd msg


port gameCreated : (Json.Decode.Value -> msg) -> Sub msg


subscriptions : Model -> Sub Msg
subscriptions _ =
    gameCreated (decodeGame >> NewGame)


update msg model =
    case msg of
        JoinGame ->
            ( model, createSocket () )

        NewGame (Err err) ->
            ( model, Cmd.none )

        NewGame (Ok game) ->
            ( { model | game = Just game }, Cmd.none )


view : Model -> Html Msg
view model =
    div [ class "container" ]
        [ h2 [ class "text-center" ] [ text "Play!" ]
        , p [ class "text-center" ]
            [ button [ class "btn btn-success", onClick JoinGame ] [ text "Join Game" ]
            , p []
                [ p [] (viewGame model.game)
                ]
            ]
        , blockquote []
            [ p [] []
            ]
        ]


viewGame : Maybe Game -> List (Html Msg)
viewGame maybeGame =
    case maybeGame of
        Just game ->
            [ main_ []
                [ viewFactories (Array.slice 0 3 game.factories) "left_factories"
                , viewMainBoard game
                , viewFactories (Array.slice 3 5 game.factories) "right_factories"
                ]
            ]

        Nothing ->
            [ text "nothing yet" ]


viewMainBoard game =
    section [ id "main_board" ]
        [ div [ id "upper_main_board" ]
            [ viewPatternLines game.patternLines ]
        ]


viewFactories factories htmlId =
    section [ id htmlId, class "factories" ]
        (Array.map
            viewFactory
            factories
            |> Array.toList
        )


viewFactory factory =
    div [ class "factory" ]
        [ div [ class "inner_factory" ]
            (Array.map
                viewTile
                factory.tiles
                |> Array.toList
            )
        ]


viewPatternLines patternLines =
    div [ id "pattern_lines" ]
        (Array.map
            viewPatternLine
            patternLines
            |> Array.toList
        )


viewPatternLine patternLine =
    div [ class "pattern_line" ]
        (Array.map
            viewPatternSpot
            patternLine
            |> Array.toList
        )


viewPatternSpot patternSpot =
    div [ class "pattern_spot" ]
        [ case patternSpot.colour of
            Just colour ->
                div [ class "tile" ] [ text (colourToString colour) ]

            Nothing ->
                div [] []
        ]


viewTile tile =
    div [ class "factory_spot" ] [ text (colourFromTile tile) ]


colourFromTile tile =
    colourToString tile.colour


colourToString colour =
    case colour of
        Bu ->
            "Bu"

        Y ->
            "Y"

        R ->
            "R"

        Ba ->
            "Ba"

        W ->
            "W"


decodeGame : Json.Decode.Value -> Result Json.Decode.Error Game
decodeGame =
    Json.Decode.decodeValue gameDecoder


gameDecoder : Json.Decode.Decoder Game
gameDecoder =
    Json.Decode.succeed Game
        |> PipelineDecoder.required "factories" (Json.Decode.array factoryDecoder)
        |> PipelineDecoder.required "patternLines" (Json.Decode.array (Json.Decode.array patternSpotDecoder))


factoryDecoder : Json.Decode.Decoder Factory
factoryDecoder =
    Json.Decode.succeed Factory
        |> PipelineDecoder.required "id" Json.Decode.int
        |> PipelineDecoder.required "tiles" (Json.Decode.array tileDecoder)


patternSpotDecoder : Json.Decode.Decoder PatternSpot
patternSpotDecoder =
    Json.Decode.succeed PatternSpot
        |> PipelineDecoder.required "index" Json.Decode.int
        |> PipelineDecoder.required "colour" (Json.Decode.maybe colourDecoder)


tileDecoder : Json.Decode.Decoder Tile
tileDecoder =
    Json.Decode.succeed Tile
        |> PipelineDecoder.required "id" Json.Decode.int
        |> PipelineDecoder.required "colour" colourDecoder


colourDecoder : Json.Decode.Decoder Colour
colourDecoder =
    Json.Decode.string
        |> Json.Decode.andThen
            (\str ->
                case str of
                    "Bu" ->
                        Json.Decode.succeed Bu

                    "Y" ->
                        Json.Decode.succeed Y

                    "R" ->
                        Json.Decode.succeed R

                    "Ba" ->
                        Json.Decode.succeed Ba

                    "W" ->
                        Json.Decode.succeed W

                    otherValue ->
                        Json.Decode.fail <| "Unknown colour: " ++ otherValue
            )


main =
    Browser.element
        { init = init
        , subscriptions = subscriptions
        , update = update
        , view = view
        }
