using System.Collections;
using UnityEngine;
using UnityEngine.UI;

public class Character_image_loader : MonoBehaviour
{
    enum Change_effects
    {
        
    };
    public void Change_image(Image character, Sprite img, string Effect_priority)
    {
        StartCoroutine(Change_priority_check(character, img, Effect_priority));
    }

    IEnumerator Change_priority_check(Image character, Sprite img, string Effect_priority)
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

        character.sprite = img;
    }
}
