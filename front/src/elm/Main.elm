port module Main exposing (createSocket, gameCreated)

import Array exposing (Array)
import Browser
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Json.Decode as D
import Json.Decode.Pipeline as PipelineDecoder
import Json.Encode as E
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


type alias Factory =
    { id : Int
    , tiles : Array Tile
    }


type alias Spot =
    { index : Int
    }


type alias SpotLine =
    Array (Maybe Spot)


type alias PatternLines =
    Array SpotLine


type alias Wall =
    Array (Maybe Spot)


type alias Game =
    { factories : Array Factory
    , patternLines : PatternLines
    , wall : Wall
    }


type alias Model =
    { game : Maybe Game
    }


type Msg
    = JoinGame
    | NewGame (Result D.Error Game)


init : () -> ( Model, Cmd Msg )
init =
    \_ -> ( { game = Nothing }, Cmd.none )


port createSocket : () -> Cmd msg


port gameCreated : (E.Value -> msg) -> Sub msg


subscriptions : Model -> Sub Msg
subscriptions model =
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
            [ viewPatternLines game.patternLines
            , viewWall game.wall
            ]
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
        [ case patternSpot of
            Just { index } ->
                div [ class "tile" ] [ text (String.fromInt index) ]

            Nothing ->
                div [] []
        ]


viewWall wall =
    div [ id "wall" ]
        (Array.map
            viewWallSpot
            wall
            |> Array.toList
        )


viewWallSpot wallSpot =
    div [ class "wall_spot" ]
        [ case wallSpot of
            Just { index } ->
                div [ class "tile" ] [ text (String.fromInt index) ]

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


decodeGame : D.Value -> Result D.Error Game
decodeGame value =
    D.decodeValue gameDecoder value


gameDecoder : D.Decoder Game
gameDecoder =
    D.succeed Game
        |> PipelineDecoder.required "factories" (D.array factoryDecoder)
        |> PipelineDecoder.required "patternLines" (D.array (D.array (D.nullable spotDecoder)))
        |> PipelineDecoder.required "wall" (D.array (D.nullable spotDecoder))


factoryDecoder : D.Decoder Factory
factoryDecoder =
    D.succeed Factory
        |> PipelineDecoder.required "id" D.int
        |> PipelineDecoder.required "tiles" (D.array tileDecoder)


spotDecoder : D.Decoder Spot
spotDecoder =
    D.succeed Spot
        |> PipelineDecoder.required "index" D.int


tileDecoder : D.Decoder Tile
tileDecoder =
    D.succeed Tile
        |> PipelineDecoder.required "id" D.int
        |> PipelineDecoder.required "colour" colourDecoder


colourDecoder : D.Decoder Colour
colourDecoder =
    D.string
        |> D.andThen
            (\str ->
                case str of
                    "Bu" ->
                        D.succeed Bu

                    "Y" ->
                        D.succeed Y

                    "R" ->
                        D.succeed R

                    "Ba" ->
                        D.succeed Ba

                    "W" ->
                        D.succeed W

                    otherValue ->
                        D.fail <| "Unknown colour: " ++ otherValue
            )


main =
    Browser.element
        { init = init
        , subscriptions = subscriptions
        , update = update
        , view = view
        }
