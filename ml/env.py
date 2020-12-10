import gym

from ml import pyazul

class AzulEnv(gym.Env):
  def __init__(self, config):
    self.game = pyazul.AzulGame(config)
  def step(self, action):
  def reset(self):


