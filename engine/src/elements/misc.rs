use std::fmt;
use serde::{Serialize, Deserialize};

use super::{
    Colour,
    ColourGroup,
    Table,
};

#[repr(C)]
#[derive(Clone, Copy,Serialize, Deserialize)]
pub enum PickedPlace {
    Center,
    Factory(usize)
}
#[repr(C)]
#[derive(Serialize, Deserialize)]
pub struct Pick {
    pub colour_group: ColourGroup,
    pub has_marker: bool
}
#[repr(C)]
#[derive(Serialize, Deserialize)]
pub struct Action {
    pub colour: Colour,
    pub pattern_line_id: usize,
    pub picked_place: PickedPlace,
    pub player_id: usize,
}
#[repr(C)]
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Round {
    id: usize,
    pub first_player: usize,
    pub marker: Option<usize>,
    pub table: Table
}

impl Round {
    pub fn new(player_count: usize) -> Self {
        Self{
            id: 0,
            first_player: 0,
            marker: None,
            table: Table::new(player_count)
        }
    }

    pub fn is_factory_offer_ended(&self) -> bool {
        if self.table.center.len() > 0 {
            return false;
        }

        let non_empty_factory = self.table.factories
                .iter()
                .find(|factory| factory.len() > 0);

        non_empty_factory.is_none()
    }
}

impl fmt::Display for Round {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}", self.table)
    }
}
#[repr(C)]
pub enum ActionResult {
    End,
    NewRound(Round),
    Pick,
}

#[repr(C)]
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct PatternLine {
    pub colour_group: ColourGroup,
    pub index: usize,
}

#[repr(C)]
#[derive(Clone, Copy, Debug, Serialize, Deserialize)]
pub struct WallTile {
    pub colour: Colour,
    pub is_covered: bool
}

impl fmt::Display for WallTile {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let formatted = if self.is_covered {
            format!("{}", self.colour)
        } else {
            format!(" ")
        };

        write!(
            f,
            "{}",
            formatted
        )
    }
}