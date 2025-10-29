using UnityEngine;
using UnityEngine.InputSystem;

public class Click_checker : MonoBehaviour
{
    public void Update()
    {
        if (Current_variables.Click_to_skip == false && Current_variables.Click_to_skip_allowed == true && (Input.GetMouseButtonDown(0) || Input.GetKeyDown(KeyCode.Return)))
        {
            Click_trigger();
        }
    }

    public void Click_trigger()
    {
        if (Current_variables.End_scene == true)
        {
            Current_variables.End_scene = false;
            Current_variables.Background_swap_phase = 0;
            Object_links.scene_swap_animations.ChangeScene(Current_variables.Current_Scene_ID, Dictionaries.all_scenes[Current_variables.Current_Scene_ID][1], false, false);
        }
        else
        {
            Current_variables.Click_to_skip = true;
            //ѕозже, вместо этого, будем вызывать скрипт, который принудительно будет заставл€ть текст завершитьс€, он же будет блокировать переменную click и возвращать ее в норму, во избежание повторных срабатываний.
        }
    }
}
