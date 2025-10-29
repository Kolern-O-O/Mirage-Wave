using UnityEngine;

public class Scene_start : MonoBehaviour
{
    public static void StartScene(string ID)
    {
        Object_links.scene_swap_animations.ChangeScene("Null", ID, true, true);
    }
}
