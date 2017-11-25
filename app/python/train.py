import random

if __name__ == "__main__":
	from sys import argv
	from time import sleep
	sleep(100)
	print {"i": argv[1], "j": argv[2], "k":argv[3], "image": argv[4], "accuracy": random.random()}