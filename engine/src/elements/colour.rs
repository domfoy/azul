use std::fmt;
use std::slice::Iter;
use serde::{Serialize, Deserialize};

#[repr(C)]
#[derive(Clone, Copy, Debug, Eq, PartialEq, Serialize, Deserialize)]
pub enum Colour {
    #[serde(rename="A")]
    Black,
    #[serde(rename="B")]
    Blue,
    #[serde(rename="C")]
    Red,
    #[serde(rename="D")]
    White,
    #[serde(rename="E")]
    Yellow,
}

impl Colour {
    pub fn iterator() -> Iter<'static, Colour> {
        use Colour::*;
        static COLOURS: [Colour; 5] = [
        Black,
        Blue,
        Red,
        White,
        Yellow,
        ];

        COLOURS.iter()
    }
}

impl fmt::Display for Colour {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        use Colour::*;

        match self {
            Black => write!(f, "A"),
            Blue => write!(f, "B"),
            Red => write!(f, "C"),
            White => write!(f, "D"),
            Yellow => write!(f, "E"),
        }
    }
}

#[repr(C)]
#[derive(Clone, Copy, Debug, Eq, PartialEq, Serialize, Deserialize)]
#[serde(untagged)]
pub enum ExtendedColour {
    Colour(Colour),
    #[serde(rename="M")]
    Marker,
}

impl fmt::Display for ExtendedColour {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            ExtendedColour::Colour(colour) => write!(f, "{}", colour),
            ExtendedColour::Marker => write!(f, "M"),
        }
    }
}