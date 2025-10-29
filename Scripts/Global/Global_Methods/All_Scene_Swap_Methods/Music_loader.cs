using System.Collections;
using UnityEngine;
using UnityEngine.Audio;

public class Music_loader : MonoBehaviour
{
    public AudioSource music;

    enum Effect_names
    {
        Fade,
    }

    public void Play_music(string ID, string Effect_name)
    {
        if (ID != ""){
            Music_effects(ID, Effect_name);
        }
    }

    public void Music_effects(string ID, string Effect_name)
    {
        if (ID != "Null")
        {
            if (music.resource != Resources.Load<AudioResource>("Tables/Materials/Musics/" + ID))
            {
                switch (Effect_name)
                {
                    case "Fade":
                        StartCoroutine(Fade(ID));
                        break;
                    default:
                        music.resource = Resources.Load<AudioResource>("Tables/Materials/Musics/" + ID);
                        music.Play();
                        break;
                }
            }
        }
        else
        {
            music.Stop();
        }
    }

    IEnumerator Fade(string ID)
    {
        float elapsed = 0;
        float tick_count = 50;
        while (elapsed < Current_variables.Scene_swap_duration / 2)
        {
            if (Current_variables.Click_to_skip == true)
            {
                music.volume = 0;
                break;
            }
            music.volume -= Time.deltaTime / Current_variables.Scene_swap_duration * 2;
            yield return new WaitForEndOfFrame();
            elapsed += Time.deltaTime;
        }
        music.resource = Resources.Load<AudioResource>("Tables/Materials/Musics/" + ID);
        if (!music.isPlaying)
            music.Play();
        if (Current_variables.Click_to_skip == false)
            yield return new WaitForSeconds(Current_variables.Scene_swap_pause);
        while (elapsed < Current_variables.Scene_swap_duration)
        {
            if (Current_variables.Click_to_skip == true)
            {
                music.volume = 1;
                break;
            }
            music.volume += Time.deltaTime / Current_variables.Scene_swap_duration * 2;
            yield return new WaitForEndOfFrame();
            elapsed += Time.deltaTime;
        }
    }
}
