import cffi

ffi = cffi.FFI()
lib = None
cdef_loaded_flag = False
lib_loaded_flag = False

def try_cdef():
  global cdef_loaded_flag
  if cdef_loaded_flag:
    return True


  ffi.cdef("""
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
  """)
  cdef_loaded_flag = True
  return True

def try_load():
  global lib_loaded_flag
  global lib
  if lib_loaded_flag:
    return True
  try:
    lib = ffi.dlopen("../engine/target/debug/libazul_engine_ffi.so")
    lib_loaded_flag = True
    return True
  except OSError:
    pass
  return False

class AzulGame(object):
  def __init__(self):
    self._game = ffi.new("CGame*")
    lib.NewDefaultGame(self._game)

  def __enter__(self):
      return self

  def __exit__(self, exc_type, exc_value, traceback):
      lib.FreeGame(self._game)
      self._game = None

def main():
  with AzulGame():
    pass

try_cdef()
try_load()

if __name__ == "__main__":
  main()
