using UnityEngine;

public class Object_links : MonoBehaviour
{
    public static Background_loader background_loader;
    public static Text_loader text_loader;
    public static Music_loader music_loader;
    public static Sound_loader sound_loader;
    public static End_turn_uniq_event end_turn_uniq_event;
    public static Scene_swap_animations scene_swap_animations;
    public static Character_loader character_loader;
    public static Character_disappear_loader character_disappear_loader;
    public static Character_idle_loader character_idle_loader;
    public static Character_movement_loader character_movement_loader;
    public static Character_spawn_loader character_spawn_loader;
    public static Character_image_loader character_image_loader;


    public void Awake()
    {
        background_loader = GetComponent<Background_loader>();
        text_loader = GetComponent<Text_loader>();
        end_turn_uniq_event = GetComponent<End_turn_uniq_event>();
        scene_swap_animations = GetComponent<Scene_swap_animations>();
        music_loader = GetComponent<Music_loader>();
        sound_loader = GetComponent<Sound_loader>();
        character_loader = GetComponent<Character_loader>();
        character_disappear_loader = GetComponent<Character_disappear_loader>();
        character_idle_loader = GetComponent<Character_idle_loader>();
        character_movement_loader = GetComponent<Character_movement_loader>();
        character_spawn_loader = GetComponent<Character_spawn_loader>();
        character_image_loader = GetComponent<Character_image_loader>();
    }
}
