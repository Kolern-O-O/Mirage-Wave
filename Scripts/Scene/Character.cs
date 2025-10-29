using System.Collections;
using UnityEngine;
using UnityEngine.UI;

public class Character : MonoBehaviour
{
    public string dissapear_animation;
    public string idle_animation;

    public bool idle_active = false;
    public bool new_anim = false;

    enum Movement_effects
    {
        Tremble,
    };

    public IEnumerator IdleStart(string Effect_name)
    {
        if (idle_active == true)
            new_anim = true;
        while (idle_active == true)
            yield return null;
        switch (Effect_name)
        {
            case "Tremble":
                StartCoroutine(Tremble());
                break;
            default:
                //Уже сонный. Если нет конкретного указания, то ничего происходить не должно
                break;
        }
        yield return null;
    }

    IEnumerator Tremble()
    {
        Vector2 Current_position = transform.position;
        idle_active = true;
        float elapsed = 0;
        while (new_anim == false)
        {
            if (Current_variables.Background_swap_phase >= 2)//НАсчет второго не уверен, добавил по быстрому
            {
                Current_position = transform.position;
                if (Current_variables.Click_to_skip || Current_variables.Background_swap_phase < 2)
                    break;
                if (elapsed >= Current_variables.Char_idle_interval)
                {
                    elapsed = 0;
                    while (elapsed < 1)
                    {
                        Current_variables.Active_Animation_count++;
                        if (Current_variables.Click_to_skip || Current_variables.Background_swap_phase < 2)
                            break;
                        transform.position = Current_position + Random.insideUnitCircle * 10;
                        yield return new WaitForEndOfFrame();
                        elapsed += Time.deltaTime;
                    }
                    if (Current_variables.Click_to_skip || Current_variables.Background_swap_phase < 2)
                        Current_variables.Active_Animation_count--;
                    elapsed = 0;
                    transform.position = Current_position;
                }
                yield return new WaitForEndOfFrame();
                elapsed += Time.deltaTime;
            }
            yield return null;
        }
        transform.position = Current_position;
        new_anim = false;
        idle_active = false;

        yield return null;
    }

}
