import gym

from pyazul import AzulGame

class AzulEnv(gym.Env):
  def __init__(self, config):
    self.game = AzulGame(config)
  def step(self, action):
    self.game.addAction(action)
  def reset(self):
    self.game = AzulGame()

