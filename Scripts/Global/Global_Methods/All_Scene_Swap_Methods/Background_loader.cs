using System.Collections;
using UnityEngine;
using UnityEngine.UI;
using System.Threading;

public class Background_loader : MonoBehaviour
{
    public Image background_object;
    public Image front_object;
    enum Animation_names
    {
        Fade,
    }
    public void Background_swap(string ID, string Animation_name)
    {
        if (ID != "")
        {
            Swap_animation(ID, Animation_name);
        }
    }

    public void Swap_animation(string ID, string Animation_name)
    {
        if (ID != "" && background_object.sprite != Resources.Load<Sprite>("Tables/Materials/Backgrounds/" + ID))
        {
            switch (Animation_name)
            {
                case "Fade":
                    StartCoroutine(Fade(ID));
                    break;
                    break;
                default:
                    background_object.sprite = Resources.Load<Sprite>("Tables/Materials/Backgrounds/" + ID);
                    Current_variables.Background_swap_phase = 3;
                    break;
            }
        }
        else
            Current_variables.Background_swap_phase = 3;
    }

    IEnumerator Fade(string ID) 
    {
        float elapsed = 0;
        while (elapsed < Current_variables.Scene_swap_duration / 2)
        {
            Color color = front_object.color;
            if (Current_variables.Click_to_skip == true)
            {
                color.a = 0f;
                front_object.color = color;
                background_object.sprite = Resources.Load<Sprite>("Tables/Materials/Backgrounds/" + ID);
                break;
            }
            color.a += Time.deltaTime;
            front_object.color = color;
            yield return new WaitForEndOfFrame();
            elapsed += Time.deltaTime;
        }
        Current_variables.Background_swap_phase = 1;
        background_object.sprite = Resources.Load<Sprite>("Tables/Materials/Backgrounds/" + ID);
        if (Current_variables.Click_to_skip == false)
            yield return new WaitForSeconds(Current_variables.Scene_swap_pause);
        while (elapsed < Current_variables.Scene_swap_duration)
        {
            Color color = front_object.color;
            if (Current_variables.Click_to_skip == true)
            {
                color.a = 0f;
                front_object.color = color;
                background_object.sprite = Resources.Load<Sprite>("Tables/Materials/Backgrounds/" + ID);
                break;
            }
            color.a -= Time.deltaTime;
            front_object.color = color;
            yield return new WaitForEndOfFrame();
            elapsed += Time.deltaTime;
        }
        Current_variables.Background_swap_phase = 2;
    }
}
