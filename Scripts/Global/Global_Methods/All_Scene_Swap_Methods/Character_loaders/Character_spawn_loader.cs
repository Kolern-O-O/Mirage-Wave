using System.Collections;
using UnityEngine;
using UnityEngine.UI;

public class Character_spawn_loader : MonoBehaviour
{
    enum Spawn_effects
    {
        Transparence,
    };
    public void Spawn(GameObject character, string Effect_name, string Effect_priority)
    {
        StartCoroutine(Effect_priority_check(character, Effect_name, Effect_priority));
    }

    IEnumerator Effect_priority_check(GameObject character, string Effect_name, string Effect_priority)
    {
        bool worked = false;
        while (worked == false)
        {
            if (Current_variables.Background_swap_phase == 3)
                worked = true;
            switch (Effect_priority)
            {
                case "Before":
                    if (Current_variables.Background_swap_phase == 0)
                        worked = true;
                    break;
                case "Default":
                    if (Current_variables.Background_swap_phase == 1)
                        worked = true;
                    break;
                case "After":
                    if (Current_variables.Background_swap_phase == 2)
                        worked = true;
                    break;
                default:
                    worked = true;
                    break;
            }
            if (Current_variables.Click_to_skip)
                break;
            yield return null;
        }

        switch (Effect_name)
        {
            case "Transparence":
                StartCoroutine(Transparence(character));
                break;
            default:
                StartCoroutine(Transparence(character));
                break;
        }
    }



    IEnumerator Transparence(GameObject character)
    {
        Current_variables.Active_Animation_count++;
        Image char_img = character.GetComponent<Image>();
        Color color = char_img.color;
        //color.a = 0;
        //char_img.color = color;
        character.SetActive(true);
        float elapsed = 0;
        while (elapsed < Current_variables.Char_change_duration)
        {
            color = char_img.color;
            if (Current_variables.Click_to_skip)
            {
                color.a = 1;
                char_img.color = color;
                break;
            }
            color.a += Time.deltaTime / Current_variables.Char_change_duration;
            char_img.color = color;
            yield return new WaitForEndOfFrame();
            elapsed += Time.deltaTime;
        }
        Current_variables.Active_Animation_count--;
    }
}
