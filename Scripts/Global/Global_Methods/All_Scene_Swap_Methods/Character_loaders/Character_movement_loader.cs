using System.Collections;
using UnityEngine;
using UnityEngine.UI;

public class Character_movement_loader : MonoBehaviour
{
    enum Movement_effects
    {
        Rush,
    };
    public void Movement(GameObject character, string Effect_name, string Effect_priority, Vector3 position)
    {
        StartCoroutine(Effect_priority_check(character, Effect_name, Effect_priority, position));
    }

    IEnumerator Effect_priority_check(GameObject character, string Effect_name, string Effect_priority, Vector3 position)
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
            case "Rush":
                StartCoroutine(Rush(character, position));
                break;
            case "Null":
                character.transform.position = position;
                break;
            default:
                StartCoroutine(Rush(character, position));
                break;
        }
    }



    IEnumerator Rush(GameObject character, Vector3 position)
    {
        Current_variables.Active_Animation_count++;
        character.SetActive(true);
        Vector3 start_position = character.transform.position;
        float elapsed = 0;
        while (elapsed < Current_variables.Char_change_duration)
        {
            if (Current_variables.Click_to_skip)
            {
                character.transform.position = position;
                break;
            }
            character.transform.position += (position - start_position) * Time.deltaTime / Current_variables.Char_change_duration;
            yield return new WaitForEndOfFrame();
            elapsed += Time.deltaTime;
        }
        character.transform.position = position;
        Current_variables.Active_Animation_count--;
    }
}
