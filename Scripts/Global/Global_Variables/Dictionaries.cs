using System.Collections.Generic;
using System.Linq;
using UnityEngine;

public class Dictionaries : MonoBehaviour
{
    public static Dictionary<string, List<string>> all_scenes = new Dictionary<string, List<string>>();
    public static Dictionary<string, string> texts = new Dictionary<string, string>();
    public static Dictionary<string, string> background_change_effects = new Dictionary<string, string>();
    public static Dictionary<string, string> text_change_effects = new Dictionary<string, string>();
    public static Dictionary<string, string> music_change_effects = new Dictionary<string, string>();
    public static Dictionary<string, string> sounds_change_effects = new Dictionary<string, string>();
    public static Dictionary<string, string> character_spawn_animations = new Dictionary<string, string>();
    public static Dictionary<string, string> character_idle_animations = new Dictionary<string, string>();
    public static Dictionary<string, string> character_movement_animations = new Dictionary<string, string>();
    public static Dictionary<string, string> character_disappear_animations = new Dictionary<string, string>();
}
