using UnityEngine;

public class Current_variables : MonoBehaviour
{
    public static bool Scene_active;
    public static string Current_Scene_ID;
    public static bool End_scene;
    public static bool Click_to_skip;
    public static bool Click_to_skip_allowed = true;

    public static float text_speed = 0.5f;

    public static float Scene_swap_duration = 2;
    public static float Scene_swap_pause = 0.5f;
    public static float Char_idle_interval = 5;
    public static float Char_change_duration = 1f;

    public static byte Character_cout = 0;
    public static bool Character_is_load = true;
    public static byte Active_Animation_count = 0;
    public static byte Background_swap_phase = 0;
}
