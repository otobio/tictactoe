<?php

namespace Dao;

class GameDao
{

    protected $db;

    public function __construct($instance)
    {
        $this->db = $instance;
    }

    public function save(string $gameId, array $players, array $boardHistory): bool
    {
        $row = $this->db->where('game_id', '=', $gameId)->find();
        if ($row->count() > 0) {
            $row->players_and_characters = json_encode($players);
            $row->gameplay = json_encode($boardHistory);
        } else {
            $row->game_id = $gameId;
            $row->players_and_characters = json_encode($players);
            $row->gameplay = json_encode($boardHistory);
        }

        return (bool) $row->save();
    }

    public function remove(string $gameId): bool
    {
        return $this->db->where('game_id', '=', $gameId)->find()->delete();
    }

    public function get(string $gameId)
    {
        $row = $this->db->where('game_id', '=', $gameId)->find();
        if ($row->count() > 0) {
            return $row;
        }
    }
}
