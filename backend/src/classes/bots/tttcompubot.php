<?php

namespace Bots;

class TTTCompuBot
{

    protected $board = [];
    protected $char;

    private $opponentBoxes = [];
    private $myBoxes = [];
    private $freeBoxes = [];

    public function __construct($currentBoard, $character)
    {
        $this->board = $currentBoard;
        $this->char = $character;

        $this->identifyBoxes();
    }

    private function identifyBoxes()
    {
        foreach ($this->board as $index => $box) {
            if ($box == $this->char) {
                $this->myBoxes[] = $index;
            } elseif ($box == '') {
                $this->freeBoxes[] = $index;
            } else {
                $this->opponentBoxes[] = $index;
            }
        }
    }

    private function checkForWin(array $boxes): int
    {
        $POSSIBLE_MATCHES = [
            [0, 1, 2],
            [0, 3, 6],
            [0, 4, 8],
            [1, 4, 7],
            [2, 5, 8],
            [2, 4, 6],
            [3, 4, 5],
            [6, 7, 8],
        ];

        foreach ($POSSIBLE_MATCHES as $groupMatch) {
            $matches = [];
            foreach ($groupMatch as $box) {
                if (in_array($box, $boxes)) {
                    $matches[] = $box;
                }
            }

            if (count($matches) === 2 && in_array(array_values(array_diff($groupMatch, $matches))[0], $this->freeBoxes)) {
                return array_values(array_diff($groupMatch, $matches))[0];
            }
        }

        return -1;
    }

    # Basically a place to create two ways
    public function checkForFork(array $boxes): int
    {
        /**
         * Priorities
         * -> Choose center
         * -> Choose Corners
         */

        /**
         *
        TODO

        Option 1: Create two in a row to force the opponent into defending, as long as it doesn't result in them creating a fork or winning. For example, if "X" has a corner, "O" has the center, and "X" has the opposite corner as well, "O" must not play a corner in order to win. (Playing a corner in this scenario creates a fork for "X" to win.)

        Option 2: If there is a configuration where the opponent can fork, block that fork.

        Center: Play the center.

        Opposite Corner: If the opponent is in the corner, play the opposite corner.

        Empty Corner: Play an empty corner.

        Empty Side: Play an empty side.
         */

        if (in_array(4, $this->freeBoxes)) {
            return 4;
        } elseif (!empty(array_diff([0, 2, 6, 8], $this->freeBoxes))) {
            $choices = array_diff([0, 2, 6, 8], $this->freeBoxes);
            if (count($choices) > 1) {
                return $choices[array_rand($choices, 1)];
            } else {
                $choices[0];
            }
        }

        return -1;
    }

    public function playRandomly(): int
    {
        if (!empty($this->freeBoxes)) {
            return $this->freeBoxes[array_rand($this->freeBoxes, 1)];
        }
    }

    public function getPlay(): int
    {
        /**
         *
         * Strategy

        Win: If you have two in a row, play the third to get three in a row.

        Block: If the opponent has two in a row, play the third to block them.

        LookForKnownFork: Create an opportunity where you can win in two ways.

        Play Randomly
         */

        if ($this->checkForWin($this->myBoxes) !== -1) {
            return $this->checkForWin($this->myBoxes);
        } elseif ($this->checkForWin($this->opponentBoxes) !== -1) {
            return $this->checkForWin($this->opponentBoxes);
        } elseif ($this->checkForFork($this->myBoxes) !== -1) {
            return $this->checkForFork($this->myBoxes);
        } else {
            return $this->playRandomly();
        }
    }
}
