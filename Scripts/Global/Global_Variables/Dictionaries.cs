using System.Collections.Generic;
using System.Linq;
using UnityEngine;

public class Dictionaries : MonoBehaviour
{
    public Dictionary<string, List<string>> all_scenes = new Dictionary<string, List<string>>();
    //public Dictionary<string, string> background_effects = new Dictionary<string, string>(); 
    public Dictionary<string, string> texts = new Dictionary<string, string>();
    //public Dictionary<string, string> text_effects = new Dictionary<string, string>();
    //public Dictionary<string, string> music_effects = new Dictionary<string, string>();
    //public Dictionary<string, string> sounds_effects = new Dictionary<string, string>();
    //public Dictionary<string, string> spawn_animations = new Dictionary<string, string>();
    //public Dictionary<string, string> move_animations = new Dictionary<string, string>();
    //public Dictionary<string, string> idle_animations = new Dictionary<string, string>();
    //public Dictionary<string, string> character_images = new Dictionary<string, string>();

    public void Start()
    {
        string all_scenes_contains = Resources.Load<TextAsset>("Tables/CSV/Scene_info").text;
        string[] lines = all_scenes_contains.Split('\n');
        int op_num = 0;
        foreach (string line in lines)
        {
            if (op_num != 0 && line != "")
            {
                string[] elements = line.Trim().Split('§');
                all_scenes[elements[0]] = new List<string>(elements);
            }
                op_num++;
        }

        string text_contains = Resources.Load<TextAsset>("Tables/CSV/Text_info").text;
        lines = text_contains.Split('\n');
        op_num = 0;
        foreach (string line in lines)
        {
            if (op_num != 0 && line != "")
            {
                string[] elements = line.Trim().Split('§');
                texts[elements[0]] = elements[1];
            }
            op_num++;
        }

        Debug.Log(all_scenes["ID_TestScene_01"][4]);

        Object_links.text_loader.Text_swap(texts[all_scenes["ID_TestScene_01"][4]]);
        Object_links.background_loader.Background_swap(all_scenes["ID_TestScene_01"][2]); // это ради теста, не забыть переместить в основной файл
    }
}
