using System.Collections;
using UnityEngine;
using UnityEngine.UI;

public class Character_idle_loader : MonoBehaviour
{
    enum Movement_effects
    {
        Tremble,
    };
    public void Idle(GameObject character, string Effect_name)
    {
        if (Effect_name != "Null")
        {
            Character Char = character.GetComponent<Character>();
            if (Char.idle_animation != Effect_name)
            {
                Char.StartCoroutine(character.GetComponent<Character>().IdleStart(Effect_name));
                Char.idle_animation = Effect_name;
            }
        }
    }
}
