import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Boss } from '../models/boss.model';

@Component({
  selector: 'app-choose-boss',
  templateUrl: './choose-boss.component.html',
  styleUrls: ['./choose-boss.component.scss']
})
export class ChooseBossComponent implements OnInit {
  bosses: Boss[] = [];

  constructor(private router: Router) { }

  ngOnInit(): void {
    const boss: Boss = {
      id: "troll-king",
      name: "Troll King",
      subtitle: "I've never seen such a creature, it must be 50 feet tall",
      description: "Death, destruction, and healing. You will need to fight as a team to take down the Troll King",
      imagePath: "../../assets/TrollKing.jpg",
      colours: ["Red", "Green", "Black"]
    }
    
    this.bosses.push(boss);
  }

  choose(valueEmitted: string) {
    console.log(valueEmitted);

    // this.service.getBossAbilities(valueEmitted).subscribe(
    //   (abilities: BossAbility[]) => {
    //     console.log(abilities);
    //   });
    this.router.navigate(['/game', { file: valueEmitted}]);
  }

}
