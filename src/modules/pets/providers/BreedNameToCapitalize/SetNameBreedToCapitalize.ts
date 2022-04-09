class SetNameBreedToCapitalize {
  public capitalizeName(name: string): string {
    return `${name.charAt(0).toUpperCase()}${name.substring(1).toLowerCase()}`;
  }
}

export default SetNameBreedToCapitalize;
