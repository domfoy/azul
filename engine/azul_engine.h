#include <stdarg.h>
#include <stdbool.h>
#include <stdint.h>
#include <stdlib.h>

typedef struct Option_usize Option_usize;

typedef struct Vec_ColourGroup Vec_ColourGroup;

typedef struct Vec_Player Vec_Player;

typedef struct Vec_Vec_ColourGroup Vec_Vec_ColourGroup;

typedef struct {
  Vec_ColourGroup _0;
} Bag;

typedef struct {
  Vec_ColourGroup center;
  Vec_Vec_ColourGroup factories;
} Table;

typedef struct {
  uintptr_t id;
  uintptr_t first_player;
  Option_usize marker;
  Table table;
} Round;

typedef struct {
  Bag bag;
  Vec_Player players;
  Round round;
} Game;

typedef struct {
  Game *game;
} CGame;

void NewDefaultGame(CGame *ptr);

void FreeGame(CGame *ptr);
