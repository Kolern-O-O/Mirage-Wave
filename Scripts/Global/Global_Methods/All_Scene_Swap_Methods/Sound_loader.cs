using System.Collections;
using UnityEngine;
using UnityEngine.Audio;

public class Sound_loader : MonoBehaviour
{
    public AudioSource sound;

    enum Effect_names
    {
        Fade,
    }
    public void Play_sound(string ID, string Effect_name, string Effect_priority)
    {
        if (ID != "")
        {
            StartCoroutine(Effect_priority_check(ID, Effect_name, Effect_priority));
        }
    }

    IEnumerator Effect_priority_check(string ID, string Effect_name, string Effect_priority)
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
            case "Fade":
                StartCoroutine(Fade(ID, Effect_priority));
                break;
            default:
                sound.resource = Resources.Load<AudioResource>("Tables/Materials/Sounds/" + ID);
                sound.Play();
                break;
        }
    }

    IEnumerator Fade(string ID, string Effect_priority)
    {
        
        if (!Current_variables.Click_to_skip)
        {
            sound.resource = Resources.Load<AudioResource>("Tables/Materials/Sounds/" + ID);
            sound.volume = 1;
            sound.Play();
            while ((sound.volume > 0 || sound.isPlaying) && !Current_variables.Click_to_skip)
            {
                sound.volume -= Time.deltaTime / sound.clip.length;
                yield return null;
            }
        }
        if (sound.isPlaying)
            sound.Stop();
    }
}
