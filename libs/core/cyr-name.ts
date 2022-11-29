/* eslint-disable */
// GNU LICENSE ORIGINAL: https://github.com/miyconst/Cyriller

export class CyrName {
  public Decline(Surname, Name, Patronymic, Case, Gender, Shorten) {
    if (!Case) {
      Case = 1;
    }

    if (!Gender) {
      Gender = 0;
    }

    if (!Shorten) {
      Shorten = false;
    }

    let temp = null;
    let caseNumber = 0;
    let surname = null;
    let name = null;
    let patronymic = null;
    let patronymicAfter = null;
    let patronymicBefore = null;
    let gender = 0;
    let isFeminine = false;
    let index = 0;
    let surnameNew = null;
    let surnameOld = null;

    caseNumber = Case;
    gender = Gender;
    surname = this.ProperCase(Surname);
    name = this.ProperCase(Name);
    patronymic = this.ProperCase(Patronymic);
    patronymicBefore = '';
    patronymicAfter = '';

    if (this.StartsWith(patronymic, 'Ибн')) {
      patronymicBefore = 'ибн ';
      patronymic = patronymic.substring(4);
    }

    if (this.EndsWith(patronymic, '-оглы') || this.EndsWith(patronymic, '-кызы')) {
      patronymicAfter = patronymic.substring(patronymic.length - 5);
      patronymic = patronymic.substring(0, patronymic.length - 5);
    }

    if (this.StartsWith(patronymic, 'Оглы') || this.StartsWith(patronymic, 'Кызы')) {
      patronymicAfter = patronymic.substring(patronymic.length - 4);
      patronymic = patronymic.substring(0, patronymic.length - 4);
    }

    if (caseNumber < 1 || caseNumber > 6) {
      caseNumber = 1;
    }

    if (gender < 0 || gender > 2) {
      gender = 0;
    }

    if (gender === 0) {
      gender = this.EndsWith(patronymic, 'на') ? 2 : 1;
    }

    isFeminine = gender === 2;

    surnameOld = surname;
    surnameNew = '';
    index = surnameOld.indexOf('-');

    while (index > 0) {
      temp = this.ProperCase(surnameOld.substring(0, index));
      surnameNew = surnameNew + this.DeclineSurname(temp, caseNumber, isFeminine) + '-';
      surnameOld = surnameOld.substring(index + 1);
      index = surnameOld.indexOf('-');
    }

    temp = this.ProperCase(surnameOld);
    surnameNew = surnameNew + this.DeclineSurname(temp, caseNumber, isFeminine);
    surname = surnameNew;

    switch (caseNumber) {
      case 2:
        name = this.DeclineNameGenitive(name, isFeminine, Shorten);
        patronymic = this.DeclinePatronymicGenitive(patronymic, patronymicAfter, isFeminine, Shorten);
        break;

      case 3:
        name = this.DeclineNameDative(name, isFeminine, Shorten);
        patronymic = this.DeclinePatronymicDative(patronymic, patronymicAfter, isFeminine, Shorten);
        break;

      case 4:
        name = this.DeclineNameAccusative(name, isFeminine, Shorten);
        patronymic = this.DeclinePatronymicAccusative(patronymic, patronymicAfter, isFeminine, Shorten);
        break;

      case 5:
        name = this.DeclineNameInstrumental(name, isFeminine, Shorten);
        patronymic = this.DeclinePatronymicInstrumental(patronymic, patronymicAfter, isFeminine, Shorten);
        break;

      case 6:
        name = this.DeclineNamePrepositional(name, isFeminine, Shorten);
        patronymic = this.DeclinePatronymicPrepositional(patronymic, patronymicAfter, isFeminine, Shorten);
        break;
    }

    if (!Shorten) {
      patronymic = patronymicBefore + patronymic + patronymicAfter;
    }

    return (surname + ' ' + name + ' ' + patronymic).trim();
  }

  public DeclineFullName(FullName, Case, Gender, Shorten) {
    if (!Case) {
      Case = 1;
    }

    if (!Gender) {
      Gender = 0;
    }

    if (!Shorten) {
      Shorten = false;
    }

    let surname = null;
    let name = null;
    let patronymic = null;
    let str1 = null;
    let str2 = null;
    let str3 = null;
    let index = 0;

    index = FullName.indexOf(' ');

    if (index > 0) {
      str1 = FullName.substring(0, index).trim().toLowerCase();
      FullName = FullName.substring(index).trim();

      index = FullName.indexOf(' ');

      if (index > 0) {
        str2 = FullName.substring(0, index).trim().toLowerCase();
        str3 = FullName.substring(index).trim().toLowerCase();
      } else {
        str2 = FullName.trim().toLowerCase();
      }
    } else {
      str1 = FullName.trim().toLowerCase();
    }

    if (str3) {
      if (this.EndsWith(str2, 'ич') || this.EndsWith(str2, 'вна') || this.EndsWith(str2, 'чна')) {
        surname = this.ProperCase(str3);
        name = this.ProperCase(str1);
        patronymic = this.ProperCase(str2);
      } else {
        surname = this.ProperCase(str1);
        name = this.ProperCase(str2);
        patronymic = this.ProperCase(str3);
      }
    } else {
      if (this.EndsWith(str2, 'ич') || this.EndsWith(str2, 'вна') || this.EndsWith(str2, 'чна')) {
        name = this.ProperCase(str1);
        patronymic = this.ProperCase(str2);
      } else {
        surname = this.ProperCase(str1);
        name = this.ProperCase(str2);
      }
    }

    return this.Decline(surname, name, patronymic, Case, Gender, Shorten);
  }

  public EndsWith(Value, Suffix) {
    return Value.indexOf(Suffix, Value.length - Suffix.length) !== -1;
  }

  public StartsWith(Value, Prefix) {
    return Value.indexOf(Prefix) === 0;
  }

  public ProperCase(Value) {
    if (!Value) {
      return '';
    }

    Value = Value.toLowerCase();

    return Value[0].toUpperCase() + Value.substring(1);
  }

  public SetEnd(Value, Cut, Add = null) {
    if (!Add) {
      return this.SetEnd(Value, Cut.length, Cut);
    }

    return Value.substring(0, Value.length - Cut) + Add;
  }

  public SubstringRight(Value, Cut) {
    return Value.substring(Value.length - Cut);
  }

  public PreLastChar(Value) {
    return Value.substring(Value.length - 2, Value.length - 1);
  }

  /// <summary>
  /// Родительный, Кого? Чего? (нет)
  /// </summary>
  /// <param name='Name'></param>
  /// <param name='IsFeminine'></param>
  /// <returns></returns>
  public DeclineNameGenitive(Name, IsFeminine, Shorten) {
    let temp;

    if (Name.length <= 1 || this.EndsWith(Name, '.')) {
      return Name;
    }

    if (Shorten) {
      Name = Name.substring(0, 1) + '.';
    } else {
      temp = Name;

      switch (this.SubstringRight(Name, 3).toLowerCase()) {
        case 'лев':
          Name = this.SetEnd(Name, 2, 'ьва');
          break;
      }

      if (Name === temp) {
        switch (this.SubstringRight(Name, 2)) {
          case 'ей':
          case 'ий':
          case 'ай':
            Name = this.SetEnd(Name, 'я');
            break;
          case 'ел':
            Name = this.SetEnd(Name, 'ла');
            break;
          case 'ец':
            Name = this.SetEnd(Name, 'ца');
            break;
          case 'га':
          case 'жа':
          case 'ка':
          case 'ха':
          case 'ча':
          case 'ща':
            Name = this.SetEnd(Name, 'и');
            break;
        }
      }

      if (Name === temp) {
        switch (this.SubstringRight(Name, 1)) {
          case 'а':
            Name = this.SetEnd(Name, 'ы');
            break;
          case 'е':
          case 'ё':
          case 'и':
          case 'о':
          case 'у':
          case 'э':
          case 'ю':
            break;
          case 'я':
            Name = this.SetEnd(Name, 'и');
            break;
          case 'ь':
            Name = this.SetEnd(Name, IsFeminine ? 'и' : 'я');
            break;
          default:
            if (!IsFeminine) {
              Name = Name + 'а';
            }
            break;
        }
      }
    }

    return Name;
  }

  /// <summary>
  /// Дательный, Кому? Чему? (дам)
  /// </summary>
  /// <param name='Name'></param>
  /// <param name='IsFeminine'></param>
  /// <param name='Shorten'></param>
  /// <returns></returns>
  public DeclineNameDative(Name, IsFeminine, Shorten) {
    let temp;

    if (Name.length <= 1 || this.EndsWith(Name, '.')) {
      return Name;
    }

    if (Shorten) {
      Name = Name.substring(0, 1) + '.';
    } else {
      temp = Name;

      switch (this.SubstringRight(Name, 3).toLowerCase()) {
        case 'лев':
          Name = this.SetEnd(Name, 2, 'ьву');
          break;
      }

      if (Name === temp) {
        switch (this.SubstringRight(Name, 2)) {
          case 'ей':
          case 'ий':
          case 'ай':
            Name = this.SetEnd(Name, 'ю');
            break;
          case 'ел':
            Name = this.SetEnd(Name, 'лу');
            break;
          case 'ец':
            Name = this.SetEnd(Name, 'цу');
            break;
          case 'ия':
            Name = this.SetEnd(Name, 'ии');
            break;
        }
      }

      if (Name === temp) {
        switch (this.SubstringRight(Name, 1)) {
          case 'а':
          case 'я':
            Name = this.SetEnd(Name, 'е');
            break;
          case 'е':
          case 'ё':
          case 'и':
          case 'о':
          case 'у':
          case 'э':
          case 'ю':
            break;
          case 'ь':
            Name = this.SetEnd(Name, IsFeminine ? 'и' : 'ю');
            break;
          default:
            if (!IsFeminine) {
              Name = Name + 'у';
            }
            break;
        }
      }
    }

    return Name;
  }

  /// <summary>
  /// Винительный, Кого? Что? (вижу)
  /// </summary>
  /// <param name='Name'></param>
  /// <param name='IsFeminine'></param>
  /// <param name='Shorten'></param>
  /// <returns></returns>
  public DeclineNameAccusative(Name, IsFeminine, Shorten) {
    let temp;

    if (Name.length <= 1 || this.EndsWith(Name, '.')) {
      return Name;
    }

    if (Shorten) {
      Name = Name.substring(0, 1) + '.';
    } else {
      temp = Name;

      switch (this.SubstringRight(Name, 3).toLowerCase()) {
        case 'лев':
          Name = this.SetEnd(Name, 2, 'ьва');
          break;
      }

      if (Name === temp) {
        switch (this.SubstringRight(Name, 2)) {
          case 'ей':
          case 'ий':
          case 'ай':
            Name = this.SetEnd(Name, 'я');
            break;
          case 'ел':
            Name = this.SetEnd(Name, 'ла');
            break;
          case 'ец':
            Name = this.SetEnd(Name, 'ца');
            break;
        }
      }

      if (Name === temp) {
        switch (this.SubstringRight(Name, 1)) {
          case 'а':
            Name = this.SetEnd(Name, 'у');
            break;
          case 'е':
          case 'ё':
          case 'и':
          case 'о':
          case 'у':
          case 'э':
          case 'ю':
            break;
          case 'я':
            Name = this.SetEnd(Name, 'ю');
            break;
          case 'ь':
            if (!IsFeminine) {
              Name = this.SetEnd(Name, 'я');
            }
            break;
          default:
            if (!IsFeminine) {
              Name = Name + 'а';
            }
            break;
        }
      }
    }

    return Name;
  }

  /// <summary>
  /// Творительный, Кем? Чем? (горжусь)
  /// </summary>
  /// <param name='Name'></param>
  /// <param name='IsFeminine'></param>
  /// <param name='Shorten'></param>
  /// <returns></returns>
  public DeclineNameInstrumental(Name, IsFeminine, Shorten) {
    let temp;

    if (Name.length <= 1 || this.EndsWith(Name, '.')) {
      return Name;
    }

    if (Shorten) {
      Name = Name.substring(0, 1) + '.';
    } else {
      temp = Name;

      switch (this.SubstringRight(Name, 3).toLowerCase()) {
        case 'лев':
          Name = this.SetEnd(Name, 2, 'ьвом');
          break;
      }

      if (Name === temp) {
        switch (this.SubstringRight(Name, 2)) {
          case 'ей':
          case 'ий':
          case 'ай':
            Name = this.SetEnd(Name, 1, 'ем');
            break;
          case 'ел':
            Name = this.SetEnd(Name, 2, 'лом');
            break;
          case 'ец':
            Name = this.SetEnd(Name, 2, 'цом');
            break;
          case 'жа':
          case 'ца':
          case 'ча':
          case 'ша':
          case 'ща':
            Name = Name = this.SetEnd(Name, 1, 'ей');
            break;
        }
      }

      if (Name === temp) {
        switch (this.SubstringRight(Name, 1)) {
          case 'а':
            Name = this.SetEnd(Name, 1, 'ой');
            break;
          case 'е':
          case 'ё':
          case 'и':
          case 'о':
          case 'у':
          case 'э':
          case 'ю':
            break;
          case 'я':
            Name = this.SetEnd(Name, 1, 'ей');
            break;
          case 'ь':
            Name = this.SetEnd(Name, 1, IsFeminine ? 'ью' : 'ем');
            break;
          default:
            if (!IsFeminine) {
              Name = Name + 'ом';
            }
            break;
        }
      }
    }

    return Name;
  }

  /// <summary>
  /// Предложный, О ком? О чем? (думаю)
  /// </summary>
  /// <param name='Name'></param>
  /// <param name='IsFeminine'></param>
  /// <param name='Shorten'></param>
  /// <returns></returns>
  public DeclineNamePrepositional(Name, IsFeminine, Shorten) {
    let temp;

    if (Name.length <= 1 || this.EndsWith(Name, '.')) {
      return Name;
    }

    if (Shorten) {
      Name = Name.substring(0, 1) + '.';
    } else {
      temp = Name;

      switch (this.SubstringRight(Name, 3).toLowerCase()) {
        case 'лев':
          Name = this.SetEnd(Name, 2, 'ьве');
          break;
      }

      if (Name === temp) {
        switch (this.SubstringRight(Name, 2)) {
          case 'ей':
          case 'ай':
            Name = this.SetEnd(Name, 'е');
            break;
          case 'ий':
            Name = this.SetEnd(Name, 'и');
            break;
          case 'ел':
            Name = this.SetEnd(Name, 'ле');
            break;
          case 'ец':
            Name = this.SetEnd(Name, 'це');
            break;
          case 'ия':
            Name = this.SetEnd(Name, 'ии');
            break;
        }
      }

      if (Name === temp) {
        switch (this.SubstringRight(Name, 1)) {
          case 'а':
          case 'я':
            Name = this.SetEnd(Name, 'е');
            break;
          case 'е':
          case 'ё':
          case 'и':
          case 'о':
          case 'у':
          case 'э':
          case 'ю':
            break;
          case 'ь':
            Name = this.SetEnd(Name, IsFeminine ? 'и' : 'е');
            break;
          default:
            if (!IsFeminine) {
              Name = Name + 'е';
            }
            break;
        }
      }
    }

    return Name;
  }

  /// <summary>
  /// Родительный, Кого? Чего? (нет)
  /// </summary>
  /// <param name='Name'></param>
  /// <param name='IsFeminine'></param>
  /// <returns></returns>
  public DeclinePatronymicGenitive(Patronymic, PatronymicAfter, IsFeminine, Shorten) {
    if (Patronymic.length <= 1 || this.EndsWith(Patronymic, '.')) {
      return Patronymic;
    }

    if (Shorten) {
      Patronymic = Patronymic.substring(0, 1) + '.';
    } else {
      if (!PatronymicAfter) {
        switch (this.SubstringRight(Patronymic, 1)) {
          case 'а':
            Patronymic = this.SetEnd(Patronymic, 'ы');
            break;
          case 'е':
          case 'ё':
          case 'и':
          case 'о':
          case 'у':
          case 'э':
          case 'ю':
            break;
          case 'я':
            Patronymic = this.SetEnd(Patronymic, 'и');
            break;
          case 'ь':
            Patronymic = this.SetEnd(Patronymic, IsFeminine ? 'и' : 'я');
            break;
          default:
            if (!IsFeminine) {
              Patronymic = Patronymic + 'а';
            }
            break;
        }
      }
    }

    return Patronymic;
  }

  /// <summary>
  /// Дательный, Кому? Чему? (дам)
  /// </summary>
  /// <param name='Name'></param>
  /// <param name='IsFeminine'></param>
  /// <param name='Shorten'></param>
  /// <returns></returns>
  public DeclinePatronymicDative(Patronymic, PatronymicAfter, isFeminine, Shorten) {
    if (Patronymic.length <= 1 || this.EndsWith(Patronymic, '.')) {
      return Patronymic;
    }

    if (Shorten) {
      Patronymic = Patronymic.substring(0, 1) + '.';
    } else {
      if (!PatronymicAfter) {
        switch (this.SubstringRight(Patronymic, 1)) {
          case 'а':
          case 'я':
            Patronymic = this.SetEnd(Patronymic, 'е');
            break;
          case 'е':
          case 'ё':
          case 'и':
          case 'о':
          case 'у':
          case 'э':
          case 'ю':
            break;
          case 'ь':
            Patronymic = this.SetEnd(Patronymic, isFeminine ? 'и' : 'ю');
            break;
          default:
            if (!isFeminine) {
              Patronymic = Patronymic + 'у';
            }
            break;
        }
      }
    }

    return Patronymic;
  }

  /// <summary>
  /// Винительный, Кого? Что? (вижу)
  /// </summary>
  /// <param name='Name'></param>
  /// <param name='IsFeminine'></param>
  /// <param name='Shorten'></param>
  /// <returns></returns>
  public DeclinePatronymicAccusative(Patronymic, PatronymicAfter, IsFeminine, Shorten) {
    if (Patronymic.length <= 1 || this.EndsWith(Patronymic, '.')) {
      return Patronymic;
    }

    if (Shorten) {
      Patronymic = Patronymic.substring(0, 1) + '.';
    } else {
      if (!PatronymicAfter) {
        switch (this.SubstringRight(Patronymic, 1)) {
          case 'а':
            Patronymic = this.SetEnd(Patronymic, 'у');
            break;
          case 'е':
          case 'ё':
          case 'и':
          case 'о':
          case 'у':
          case 'э':
          case 'ю':
            break;
          case 'я':
            Patronymic = this.SetEnd(Patronymic, 'ю');
            break;
          case 'ь':
            if (!IsFeminine) {
              Patronymic = this.SetEnd(Patronymic, 'я');
            }
            break;
          default:
            if (!IsFeminine) {
              Patronymic = Patronymic + 'а';
            }
            break;
        }
      }
    }

    return Patronymic;
  }

  /// <summary>
  /// Творительный, Кем? Чем? (горжусь)
  /// </summary>
  /// <param name='Name'></param>
  /// <param name='IsFeminine'></param>
  /// <param name='Shorten'></param>
  /// <returns></returns>
  public DeclinePatronymicInstrumental(Patronymic, PatronymicAfter, IsFeminine, Shorten) {
    let temp;

    if (Patronymic.length <= 1 || this.EndsWith(Patronymic, '.')) {
      return Patronymic;
    }

    if (Shorten) {
      Patronymic = Patronymic.substring(0, 1) + '.';
    } else {
      if (!PatronymicAfter) {
        temp = Patronymic;

        switch (this.SubstringRight(Patronymic, 2)) {
          case 'ич':
            Patronymic = Patronymic + (Patronymic.toLowerCase() === 'ильич' ? 'ом' : 'ем');
            break;
          case 'на':
            Patronymic = this.SetEnd(Patronymic, 2, 'ной');
            break;
        }

        if (Patronymic === temp) {
          switch (this.SubstringRight(Patronymic, 1)) {
            case 'а':
              Patronymic = this.SetEnd(Patronymic, 1, 'ой');
              break;
            case 'е':
            case 'ё':
            case 'и':
            case 'о':
            case 'у':
            case 'э':
            case 'ю':
              break;
            case 'я':
              Patronymic = this.SetEnd(Patronymic, 1, 'ей');
              break;
            case 'ь':
              Patronymic = this.SetEnd(Patronymic, 1, IsFeminine ? 'ью' : 'ем');
              break;
            default:
              if (!IsFeminine) {
                Patronymic = Patronymic + 'ом';
              }
              break;
          }
        }
      }
    }

    return Patronymic;
  }

  /// <summary>
  /// Творительный, Кем? Чем? (горжусь)
  /// </summary>
  /// <param name='Name'></param>
  /// <param name='IsFeminine'></param>
  /// <param name='Shorten'></param>
  /// <returns></returns>
  public DeclinePatronymicPrepositional(Patronymic, PatronymicAfter, IsFeminine, Shorten) {
    if (Patronymic.length <= 1 || this.EndsWith(Patronymic, '.')) {
      return Patronymic;
    }

    if (Shorten) {
      Patronymic = Patronymic.substring(0, 1) + '.';
    } else {
      if (!PatronymicAfter) {
        switch (this.SubstringRight(Patronymic, 1)) {
          case 'а':
          case 'я':
            Patronymic = this.SetEnd(Patronymic, 'е');
            break;
          case 'е':
          case 'ё':
          case 'и':
          case 'о':
          case 'у':
          case 'э':
          case 'ю':
            break;
          case 'ь':
            Patronymic = this.SetEnd(Patronymic, IsFeminine ? 'и' : 'е');
            break;
          default:
            if (!IsFeminine) {
              Patronymic = Patronymic + 'е';
            }
            break;
        }
      }
    }

    return Patronymic;
  }

  /// <summary>
  /// Родительный, Кого? Чего? (нет)
  /// </summary>
  /// <param name='Surname'></param>
  /// <param name='IsFeminine'></param>
  /// <returns></returns>
  public DeclineSurnameGenitive(Surname, IsFeminine) {
    const temp = Surname;
    let end = null;

    end = this.SubstringRight(Surname, 3);

    if (!IsFeminine) {
      switch (end) {
        case 'жий':
        case 'ний':
        case 'ций':
        case 'чий':
        case 'ший':
        case 'щий':
          Surname = this.SetEnd(Surname, 2, 'его');
          break;
        case 'лец':
          Surname = this.SetEnd(Surname, 2, 'ьца');
          break;
        case 'нок':
          Surname = this.SetEnd(Surname, 'нка');
          break;
      }
    } else {
      switch (end) {
        case 'ова':
        case 'ева':
        case 'ина':
        case 'ына':
          Surname = this.SetEnd(Surname, 1, 'ой');
          break;
        case 'жая':
        case 'цая':
        case 'чая':
        case 'шая':
        case 'щая':
          Surname = this.SetEnd(Surname, 2, 'ей');
          break;
        case 'ска':
        case 'цка':
          Surname = this.SetEnd(Surname, 1, 'ой');
          break;
      }
    }

    if (Surname !== temp) {
      return Surname;
    }

    end = this.SubstringRight(Surname, 2);

    switch (end) {
      case 'га':
      case 'жа':
      case 'ка':
      case 'ха':
      case 'ча':
      case 'ша':
      case 'ща':
        Surname = this.SetEnd(Surname, 1, 'и');
        break;
    }

    if (Surname !== temp) {
      return Surname;
    }

    if (!IsFeminine) {
      switch (end) {
        case 'ок':
          Surname = this.SetEnd(Surname, 1, 'ка');
          break;
        case 'ёк':
        case 'ек':
          Surname = this.SetEnd(Surname, 2, 'ька');
          break;
        case 'ец':
          Surname = this.SetEnd(Surname, 2, 'ца');
          break;
        case 'ий':
        case 'ый':
        case 'ой':
          if (Surname.length > 4) {
            Surname = this.SetEnd(Surname, 2, 'ого');
          }
          break;
        case 'ей':
          if (Surname.toLowerCase() === 'соловей' || Surname.toLowerCase() === 'воробей') {
            Surname = this.SetEnd(Surname, 2, 'ья');
          } else {
            Surname = this.SetEnd(Surname, 2, 'ея');
          }
          break;
      }
    } else {
      switch (end) {
        case 'ая':
          Surname = this.SetEnd(Surname, 2, 'ой');
          break;
        case 'яя':
          Surname = this.SetEnd(Surname, 2, 'ей');
          break;
      }
    }

    if (Surname !== temp) {
      return Surname;
    }

    end = this.SubstringRight(Surname, 1);

    if (!IsFeminine) {
      switch (end) {
        case 'а':
          switch (this.PreLastChar(Surname)) {
            case 'а':
            case 'е':
            case 'ё':
            case 'и':
            case 'о':
            case 'у':
            case 'э':
            case 'ы':
            case 'ю':
            case 'я':
              break;
            default:
              Surname = this.SetEnd(Surname, 1, 'ы');
              break;
          }
          break;
        case 'я':
          Surname = this.SetEnd(Surname, 1, 'и');
          break;
        case 'б':
        case 'в':
        case 'г':
        case 'д':
        case 'ж':
        case 'з':
        case 'к':
        case 'л':
        case 'м':
        case 'н':
        case 'п':
        case 'р':
        case 'с':
        case 'т':
        case 'ф':
        case 'ц':
        case 'ч':
        case 'ш':
        case 'щ':
          Surname = Surname + 'а';
          break;
        case 'х':
          if (!this.EndsWith(Surname, 'их') && !this.EndsWith(Surname, 'ых')) {
            Surname = Surname + 'а';
          }
          break;
        case 'ь':
        case 'й':
          Surname = this.SetEnd(Surname, 1, 'я');
          break;
      }
    } else {
      switch (end) {
        case 'а':
          switch (this.PreLastChar(Surname)) {
            case 'а':
            case 'е':
            case 'ё':
            case 'и':
            case 'о':
            case 'у':
            case 'э':
            case 'ы':
            case 'ю':
            case 'я':
              break;
            default:
              Surname = this.SetEnd(Surname, 1, 'ы');
              break;
          }
          break;
        case 'я':
          Surname = this.SetEnd(Surname, 1, 'и');
          break;
      }
    }

    return Surname;
  }

  /// <summary>
  /// Дательный, Кому? Чему? (дам)
  /// </summary>
  /// <param name='Surname'></param>
  /// <param name='IsFeminine'></param>
  /// <returns></returns>
  public DeclineSurnameDative(Surname, IsFeminine) {
    const temp = Surname;
    let end;

    end = this.SubstringRight(Surname, 3);

    if (!IsFeminine) {
      switch (end) {
        case 'жий':
        case 'ний':
        case 'ций':
        case 'чий':
        case 'ший':
        case 'щий':
          Surname = this.SetEnd(Surname, 2, 'ему');
          break;
        case 'лец':
          Surname = this.SetEnd(Surname, 2, 'ьцу');
          break;
      }
    } else {
      switch (end) {
        case 'ова':
        case 'ева':
        case 'ина':
        case 'ына':
          Surname = this.SetEnd(Surname, 1, 'ой');
          break;
        case 'жая':
        case 'цая':
        case 'чая':
        case 'шая':
        case 'щая':
          Surname = this.SetEnd(Surname, 2, 'ей');
          break;
        case 'ска':
        case 'цка':
          Surname = this.SetEnd(Surname, 1, 'ой');
          break;
      }
    }

    if (Surname !== temp) {
      return Surname;
    }

    end = this.SubstringRight(Surname, 2);

    switch (end) {
      case 'ия':
        Surname = this.SetEnd(Surname, 1, 'и');
        break;
    }

    if (Surname !== temp) {
      return Surname;
    }

    if (!IsFeminine) {
      switch (end) {
        case 'ок':
          Surname = this.SetEnd(Surname, 2, 'ку');
          break;
        case 'ёк':
        case 'ек':
          Surname = this.SetEnd(Surname, 2, 'ьку');
          break;
        case 'ец':
          Surname = this.SetEnd(Surname, 2, 'цу');
          break;
        case 'ий':
        case 'ый':
        case 'ой':
          if (Surname.length > 4) {
            Surname = this.SetEnd(Surname, 2, 'ому');
          }
          break;
        case 'ей':
          if (Surname.toLowerCase() === 'соловей' || Surname.toLowerCase() === 'воробей') {
            Surname = this.SetEnd(Surname, 2, 'ью');
          } else {
            Surname = this.SetEnd(Surname, 2, 'ею');
          }
          break;
      }
    } else {
      switch (end) {
        case 'ая':
          Surname = this.SetEnd(Surname, 2, 'ой');
          break;
        case 'яя':
          Surname = this.SetEnd(Surname, 2, 'ей');
          break;
      }
    }

    if (Surname !== temp) {
      return Surname;
    }

    end = this.SubstringRight(Surname, 1);

    if (!IsFeminine) {
      switch (end) {
        case 'а':
          switch (this.PreLastChar(Surname)) {
            case 'а':
            case 'е':
            case 'ё':
            case 'и':
            case 'о':
            case 'у':
            case 'э':
            case 'ы':
            case 'ю':
            case 'я':
              break;
            default:
              Surname = this.SetEnd(Surname, 1, 'е');
              break;
          }
          break;
        case 'я':
          Surname = this.SetEnd(Surname, 1, 'е');
          break;
        case 'б':
        case 'в':
        case 'г':
        case 'д':
        case 'ж':
        case 'з':
        case 'к':
        case 'л':
        case 'м':
        case 'н':
        case 'п':
        case 'р':
        case 'с':
        case 'т':
        case 'ф':
        case 'ц':
        case 'ч':
        case 'ш':
        case 'щ':
          Surname = Surname + 'у';
          break;
        case 'х':
          if (!this.EndsWith(Surname, 'их') && !this.EndsWith(Surname, 'ых')) {
            Surname = Surname + 'у';
          }
          break;
        case 'ь':
        case 'й':
          Surname = this.SetEnd(Surname, 1, 'ю');
          break;
      }
    } else {
      switch (end) {
        case 'а':
          switch (this.PreLastChar(Surname)) {
            case 'а':
            case 'е':
            case 'ё':
            case 'и':
            case 'о':
            case 'у':
            case 'э':
            case 'ы':
            case 'ю':
            case 'я':
              break;
            default:
              Surname = this.SetEnd(Surname, 1, 'е');
              break;
          }
          break;
        case 'я':
          Surname = this.SetEnd(Surname, 1, 'е');
          break;
      }
    }

    return Surname;
  }

  /// <summary>
  /// Винительный, Кого? Что? (вижу)
  /// </summary>
  /// <param name='Surname'></param>
  /// <param name='IsFeminine'></param>
  /// <returns></returns>
  public DeclineSurnameAccusative(Surname, IsFeminine) {
    const temp = Surname;
    let end;

    end = this.SubstringRight(Surname, 3);

    if (!IsFeminine) {
      switch (end) {
        case 'жий':
        case 'ний':
        case 'ций':
        case 'чий':
        case 'ший':
        case 'щий':
          Surname = this.SetEnd(Surname, 2, 'его');
          break;
        case 'лец':
          Surname = this.SetEnd(Surname, 2, 'ьца');
          break;
      }
    } else {
      switch (end) {
        case 'ова':
        case 'ева':
        case 'ина':
        case 'ына':
          Surname = this.SetEnd(Surname, 'у');
          break;
        case 'ска':
        case 'цка':
          Surname = this.SetEnd(Surname, 1, 'ую');
          break;
      }
    }

    if (Surname !== temp) {
      return Surname;
    }

    end = this.SubstringRight(Surname, 2);

    if (!IsFeminine) {
      switch (end) {
        case 'ок':
          Surname = this.SetEnd(Surname, 'ка');
          break;
        case 'ёк':
        case 'ек':
          Surname = this.SetEnd(Surname, 2, 'ька');
          break;
        case 'ец':
          Surname = this.SetEnd(Surname, 'ца');
          break;
        case 'ий':
        case 'ый':
        case 'ой':
          if (Surname.length > 4) {
            Surname = this.SetEnd(Surname, 2, 'ого');
          }
          break;
        case 'ей':
          if (Surname.toLowerCase() === 'соловей' || Surname.toLowerCase() === 'воробей') {
            Surname = this.SetEnd(Surname, 'ья');
          } else {
            Surname = this.SetEnd(Surname, 'ея');
          }
          break;
      }
    } else {
      switch (end) {
        case 'ая':
          Surname = this.SetEnd(Surname, 'ую');
          break;
        case 'яя':
          Surname = this.SetEnd(Surname, 'юю');
          break;
      }
    }

    if (Surname !== temp) {
      return Surname;
    }

    end = this.SubstringRight(Surname, 1);

    if (!IsFeminine) {
      switch (end) {
        case 'а':
          switch (this.PreLastChar(Surname)) {
            case 'а':
            case 'е':
            case 'ё':
            case 'и':
            case 'о':
            case 'у':
            case 'э':
            case 'ы':
            case 'ю':
            case 'я':
              break;
            default:
              Surname = this.SetEnd(Surname, 'у');
              break;
          }
          break;
        case 'я':
          Surname = this.SetEnd(Surname, 'ю');
          break;
        case 'б':
        case 'в':
        case 'г':
        case 'д':
        case 'ж':
        case 'з':
        case 'к':
        case 'л':
        case 'м':
        case 'н':
        case 'п':
        case 'р':
        case 'с':
        case 'т':
        case 'ф':
        case 'ц':
        case 'ч':
        case 'ш':
        case 'щ':
          Surname = Surname + 'а';
          break;
        case 'х':
          if (!this.EndsWith(Surname, 'их') && !this.EndsWith(Surname, 'ых')) {
            Surname = Surname + 'а';
          }
          break;
        case 'ь':
        case 'й':
          Surname = this.SetEnd(Surname, 'я');
          break;
      }
    } else {
      switch (end) {
        case 'а':
          switch (this.PreLastChar(Surname)) {
            case 'а':
            case 'е':
            case 'ё':
            case 'и':
            case 'о':
            case 'у':
            case 'э':
            case 'ы':
            case 'ю':
            case 'я':
              break;
            default:
              Surname = this.SetEnd(Surname, 'у');
              break;
          }
          break;
        case 'я':
          Surname = this.SetEnd(Surname, 'ю');
          break;
      }
    }

    return Surname;
  }

  /// <summary>
  /// Творительный, Кем? Чем? (горжусь)
  /// </summary>
  /// <param name='Surname'></param>
  /// <param name='IsFeminine'></param>
  /// <returns></returns>
  public DeclineSurnameInstrumental(Surname, IsFeminine) {
    const temp = Surname;
    let end;

    end = this.SubstringRight(Surname, 3);

    if (!IsFeminine) {
      switch (end) {
        case 'лец':
          Surname = this.SetEnd(Surname, 2, 'ьцом');
          break;
        case 'бец':
          Surname = this.SetEnd(Surname, 2, 'цем');
          break;
        case 'кой':
          Surname = this.SetEnd(Surname, 'им');
          break;
      }
    } else {
      switch (end) {
        case 'жая':
        case 'цая':
        case 'чая':
        case 'шая':
        case 'щая':
          Surname = this.SetEnd(Surname, 'ей');
          break;
        case 'ска':
        case 'цка':
          Surname = this.SetEnd(Surname, 1, 'ой');
          break;
        case 'еца':
        case 'ица':
        case 'аца':
        case 'ьца':
          Surname = this.SetEnd(Surname, 1, 'ей');
          break;
      }
    }

    if (Surname !== temp) {
      return Surname;
    }

    end = this.SubstringRight(Surname, 2);

    if (!IsFeminine) {
      switch (end) {
        case 'ок':
          Surname = this.SetEnd(Surname, 2, 'ком');
          break;
        case 'ёк':
        case 'ек':
          Surname = this.SetEnd(Surname, 2, 'ьком');
          break;
        case 'ец':
          Surname = this.SetEnd(Surname, 2, 'цом');
          break;
        case 'ий':
          if (Surname.length > 4) {
            Surname = this.SetEnd(Surname, 'им');
          }
          break;
        case 'ый':
        case 'ой':
          if (Surname.length > 4) {
            Surname = this.SetEnd(Surname, 'ым');
          }
          break;
        case 'ей':
          if (Surname.toLowerCase() === 'соловей' || Surname.toLowerCase() === 'воробей') {
            Surname = this.SetEnd(Surname, 2, 'ьем');
          } else {
            Surname = this.SetEnd(Surname, 2, 'еем');
          }
          break;
        case 'оч':
        case 'ич':
        case 'иц':
        case 'ьц':
        case 'ьш':
        case 'еш':
        case 'ыш':
        case 'яц':
          Surname = Surname + 'ем';
          break;
        case 'ин':
        case 'ын':
        case 'ен':
        case 'эн':
        case 'ов':
        case 'ев':
        case 'ёв':
        case 'ун':
          if (
            Surname.toLowerCase() !== 'дарвин' &&
            Surname.toLowerCase() !== 'франклин' &&
            Surname.toLowerCase() !== 'чаплин' &&
            Surname.toLowerCase() !== 'грин'
          ) {
            Surname = Surname + 'ым';
          }
          break;
        case 'жа':
        case 'ца':
        case 'ча':
        case 'ша':
        case 'ща':
          Surname = this.SetEnd(Surname, 1, 'ей');
          break;
      }
    } else {
      switch (end) {
        case 'ая':
          Surname = this.SetEnd(Surname, 'ой');
          break;
        case 'яя':
          Surname = this.SetEnd(Surname, 'ей');
          break;
      }
    }

    if (Surname !== temp) {
      return Surname;
    }

    end = this.SubstringRight(Surname, 1);

    if (!IsFeminine) {
      switch (end) {
        case 'а':
          switch (this.PreLastChar(Surname)) {
            case 'а':
            case 'е':
            case 'ё':
            case 'и':
            case 'о':
            case 'у':
            case 'э':
            case 'ы':
            case 'ю':
            case 'я':
              break;
            default:
              Surname = this.SetEnd(Surname, 1, 'ой');
              break;
          }
          break;
        case 'я':
          Surname = this.SetEnd(Surname, 1, 'ей');
          break;
        case 'б':
        case 'в':
        case 'г':
        case 'д':
        case 'ж':
        case 'з':
        case 'к':
        case 'л':
        case 'м':
        case 'н':
        case 'п':
        case 'р':
        case 'с':
        case 'т':
        case 'ф':
        case 'ц':
        case 'ч':
        case 'ш':
          Surname = Surname + 'ом';
          break;
        case 'х':
          if (!this.EndsWith(Surname, 'их') && !this.EndsWith(Surname, 'ых')) {
            Surname = Surname + 'ом';
          }
          break;
        case 'щ':
          Surname = Surname + 'ем';
          break;
        case 'ь':
        case 'й':
          Surname = this.SetEnd(Surname, 1, 'ем');
          break;
      }
    } else {
      switch (end) {
        case 'а':
          switch (this.PreLastChar(Surname)) {
            case 'а':
            case 'е':
            case 'ё':
            case 'и':
            case 'о':
            case 'у':
            case 'э':
            case 'ы':
            case 'ю':
            case 'я':
              break;
            default:
              Surname = this.SetEnd(Surname, 1, 'ой');
              break;
          }
          break;
        case 'я':
          Surname = this.SetEnd(Surname, 1, 'ей');
          break;
      }
    }

    return Surname;
  }

  /// <summary>
  /// Предложный, О ком? О чем? (думаю)
  /// </summary>
  /// <param name='Surname'></param>
  /// <param name='IsFeminine'></param>
  /// <returns></returns>
  public DeclineSurnamePrepositional(Surname, IsFeminine) {
    const temp = Surname;
    let end;

    end = this.SubstringRight(Surname, 3);

    if (!IsFeminine) {
      switch (end) {
        case 'жий':
        case 'ний':
        case 'ций':
        case 'чий':
        case 'ший':
        case 'щий':
          Surname = this.SetEnd(Surname, 'ем');
          break;
        case 'лец':
          Surname = this.SetEnd(Surname, 2, 'ьце');
          break;
      }
    } else {
      switch (end) {
        case 'ова':
        case 'ева':
        case 'ина':
        case 'ына':
          Surname = this.SetEnd(Surname, 1, 'ой');
          break;
        case 'жая':
        case 'цая':
        case 'чая':
        case 'шая':
        case 'щая':
          Surname = this.SetEnd(Surname, 'ей');
          break;
        case 'ска':
        case 'цка':
          Surname = this.SetEnd(Surname, 1, 'ой');
          break;
      }
    }

    if (Surname !== temp) {
      return Surname;
    }

    end = this.SubstringRight(Surname, 2);

    switch (end) {
      case 'ия':
        Surname = this.SetEnd(Surname, 'и');
        break;
    }

    if (Surname !== temp) {
      return Surname;
    }

    if (!IsFeminine) {
      switch (end) {
        case 'ок':
          Surname = this.SetEnd(Surname, 'ке');
          break;
        case 'ёк':
        case 'ек':
          Surname = this.SetEnd(Surname, 2, 'ьке');
          break;
        case 'ец':
          Surname = this.SetEnd(Surname, 'це');
          break;
        case 'ий':
        case 'ый':
        case 'ой':
          if (Surname.length > 4) {
            Surname = this.SetEnd(Surname, 'ом');
          }
          break;
        case 'ей':
          if (Surname.toLowerCase() === 'соловей' || Surname.toLowerCase() === 'воробей') {
            Surname = this.SetEnd(Surname, 'ье');
          } else {
            Surname = this.SetEnd(Surname, 'ее');
          }
          break;
      }
    } else {
      switch (end) {
        case 'ая':
          Surname = this.SetEnd(Surname, 'ой');
          break;
        case 'яя':
          Surname = this.SetEnd(Surname, 'ей');
          break;
      }
    }

    if (Surname !== temp) {
      return Surname;
    }

    end = this.SubstringRight(Surname, 1);

    if (!IsFeminine) {
      switch (end) {
        case 'а':
          switch (this.PreLastChar(Surname)) {
            case 'а':
            case 'е':
            case 'ё':
            case 'и':
            case 'о':
            case 'у':
            case 'э':
            case 'ы':
            case 'ю':
            case 'я':
              break;
            default:
              Surname = this.SetEnd(Surname, 'е');
              break;
          }
          break;
        case 'я':
          Surname = this.SetEnd(Surname, 'е');
          break;
        case 'б':
        case 'в':
        case 'г':
        case 'д':
        case 'ж':
        case 'з':
        case 'к':
        case 'л':
        case 'м':
        case 'н':
        case 'п':
        case 'р':
        case 'с':
        case 'т':
        case 'ф':
        case 'ц':
        case 'ч':
        case 'ш':
        case 'щ':
          Surname = Surname + 'е';
          break;
        case 'х':
          if (!this.EndsWith(Surname, 'их') && !this.EndsWith(Surname, 'ых')) {
            Surname = Surname + 'е';
          }
          break;
        case 'ь':
        case 'й':
          Surname = this.SetEnd(Surname, 'е');
          break;
      }
    } else {
      switch (end) {
        case 'а':
          switch (this.PreLastChar(Surname)) {
            case 'а':
            case 'е':
            case 'ё':
            case 'и':
            case 'о':
            case 'у':
            case 'э':
            case 'ы':
            case 'ю':
            case 'я':
              break;
            default:
              Surname = this.SetEnd(Surname, 'е');
              break;
          }
          break;
        case 'я':
          Surname = this.SetEnd(Surname, 'е');
          break;
      }
    }

    return Surname;
  }

  public DeclineSurname(Surname, Case, IsFeminine) {
    let result = Surname;

    if (Surname.length <= 1 || Case < 2 || Case > 6) {
      result = Surname;
      return result;
    }

    switch (Case) {
      case 2:
        result = this.DeclineSurnameGenitive(Surname, IsFeminine);
        break;

      case 3:
        result = this.DeclineSurnameDative(Surname, IsFeminine);
        break;

      case 4:
        result = this.DeclineSurnameAccusative(Surname, IsFeminine);
        break;

      case 5:
        result = this.DeclineSurnameInstrumental(Surname, IsFeminine);
        break;

      case 6:
        result = this.DeclineSurnamePrepositional(Surname, IsFeminine);
        break;
    }

    return result;
  }
}
