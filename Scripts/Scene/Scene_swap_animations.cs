using System.Collections;
using UnityEngine;

public class Scene_swap_animations : MonoBehaviour
{
    enum Numbers_in_table
    {
        Scene_ID = 0,
        NextScene_ID = 1,
        Background_ID = 2,
        Background_change_animation_ID = 3,
        Text_ID = 4,
        Text_change_animation_ID = 5,
        Text_animation_priority = 6,
        Music_ID = 7,
        Music_change_effect_ID = 8,
        Sound_ID = 9,
        Sound_change_effect_ID = 10,
        Sound_effect_priority = 11,
    }
    public void ChangeScene(string ID_current, string ID_next, bool is_load, bool ignore_event)
    {
        if (is_load)
        {
            StartCoroutine(NewScene(ID_next));
        }
        else
        {
            if (ignore_event == true || !Object_links.end_turn_uniq_event.Event_activate(ID_current))
            {
                StartCoroutine(NextScene(ID_next));
            }
        }
        if (Current_variables.Click_to_skip == true)
            Current_variables.Click_to_skip = false;

    }

    IEnumerator NewScene(string ID_next)
    {
        StartCoroutine(ChangeScene(ID_next));
        yield return null;
    }

    IEnumerator NextScene(string ID_next)
    {
        StartCoroutine(ChangeScene(ID_next));
        yield return null;
    }

    IEnumerator ChangeScene(string ID_next)
    {
        Object_links.background_loader.Background_swap(Dictionaries.all_scenes[ID_next][(int)Numbers_in_table.Background_ID], Dictionaries.all_scenes[ID_next][(int)Numbers_in_table.Background_change_animation_ID]);
        Object_links.music_loader.Play_music(Dictionaries.all_scenes[ID_next][(int)Numbers_in_table.Music_ID], Dictionaries.all_scenes[ID_next][(int)Numbers_in_table.Music_change_effect_ID]);
        Object_links.sound_loader.Play_sound(Dictionaries.all_scenes[ID_next][(int)Numbers_in_table.Sound_ID], Dictionaries.all_scenes[ID_next][(int)Numbers_in_table.Sound_change_effect_ID], Dictionaries.all_scenes[ID_next][(int)Numbers_in_table.Sound_effect_priority]);
        Current_variables.Character_is_load = false;
        Object_links.character_loader.Character_swap(ID_next);
        while (Current_variables.Background_swap_phase < 2 && Current_variables.Character_is_load)
            yield return null;
        Object_links.text_loader.Text_swap(Dictionaries.texts[Dictionaries.all_scenes[ID_next][(int)Numbers_in_table.Text_ID]], Dictionaries.all_scenes[ID_next][(int)Numbers_in_table.Text_change_animation_ID]);

        while (Current_variables.End_scene == false)
            yield return null;
        Current_variables.Current_Scene_ID = ID_next;
        Current_variables.Click_to_skip = false;
        yield return null;
    }
}
