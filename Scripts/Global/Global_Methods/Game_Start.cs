using System.Collections.Generic;
using UnityEngine;

public class Game_Start : MonoBehaviour
{
    public void Start()
    {
        Dictionaries_load();
        Scene_start.StartScene("ID_TestScene_01");
    }

    public void Dictionaries_load()
    {
        string table_contains = Resources.Load<TextAsset>("Tables/CSV/Scene_info").text;
        string[] lines = table_contains.Split('\n');
        int op_num = 0;
        foreach (string line in lines)
        {
            if (op_num != 0 && line != "")
            {
                string[] elements = line.Trim().Split('§');
                Dictionaries.all_scenes[elements[0]] = new List<string>(elements);
            }
            op_num++;
        }

        table_contains = Resources.Load<TextAsset>("Tables/CSV/Text_info").text;
        lines = table_contains.Split('\n');
        op_num = 0;
        foreach (string line in lines)
        {
            if (op_num != 0 && line != "")
            {
                string[] elements = line.Trim().Split('§');
                Dictionaries.texts[elements[0]] = elements[1];
            }
            op_num++;
        }

        Fill_the_dictionary(Dictionaries.background_change_effects, "Change_bg_info");
        Fill_the_dictionary(Dictionaries.text_change_effects, "Change_text_info");
        Fill_the_dictionary(Dictionaries.music_change_effects, "Change_music_info");
        Fill_the_dictionary(Dictionaries.sounds_change_effects, "Change_sound_info");
        Fill_the_dictionary(Dictionaries.character_spawn_animations, "Character_spawn_info");
        Fill_the_dictionary(Dictionaries.character_idle_animations, "Character_idle_info");
        Fill_the_dictionary(Dictionaries.character_movement_animations, "Character_movement_info");
        Fill_the_dictionary(Dictionaries.character_disappear_animations, "Character_disappear_info");
    }

    public void Fill_the_dictionary(Dictionary<string, string> dictionary, string name)
    {
        string table_contains = Resources.Load<TextAsset>("Tables/CSV/" + name).text;
        string[] lines = table_contains.Split('\n');
        int op_num = 0;
        foreach (string line in lines)
        {
                if (op_num != 0 && line != "")
                    dictionary[line] = line;
                op_num++;
        }
    }
}
